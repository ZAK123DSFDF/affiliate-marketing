"use server"

import { user, account } from "@/db/schema"
import { db } from "@/db/drizzle"
import * as bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { returnError } from "@/lib/errorHandler"
import { sendVerificationEmail } from "@/lib/mail"
import { customAlphabet } from "nanoid"

type CreateUserPayload = {
  name: string
  email: string
  password: string
}

// Generate 6-digit numeric ID for providerAccountId
const generateCredentialsAccountId = customAlphabet("0123456789", 6)

export const SignupServer = async ({
  name,
  email,
  password,
}: CreateUserPayload) => {
  try {
    if (!email || !password || !name) {
      throw {
        status: 400,
        error: "Missing required fields.",
        toast: "Please fill in all required fields.",
        fields: {
          email: !email ? "Email is required" : "",
          password: !password ? "Password is required" : "",
          name: !name ? "Name is required" : "",
        },
      }
    }

    const normalizedEmail = email.trim().toLowerCase()
    const existingUser = await db.query.user.findFirst({
      where: (u, { eq }) => eq(u.email, normalizedEmail),
    })

    const hashedPassword = await bcrypt.hash(password, 10)

    if (existingUser) {
      // Check if credentials account already exists
      const existingAcc = await db.query.account.findFirst({
        where: (a, { and, eq }) =>
          and(eq(a.userId, existingUser.id), eq(a.provider, "credentials")),
      })

      if (existingAcc) {
        throw {
          status: 409,
          error: "User already exists.",
          toast: "This email is already registered with credentials.",
          fields: { email: "Email already in use" },
        }
      }

      // Create new credentials account for existing user
      await db.insert(account).values({
        userId: existingUser.id,
        provider: "credentials",
        providerAccountId: generateCredentialsAccountId(),
        password: hashedPassword,
      })

      const token = jwt.sign(
        {
          id: existingUser.id,
          email: existingUser.email,
          role: existingUser.role,
          type: existingUser.type,
        },
        process.env.SECRET_KEY as string,
        { expiresIn: "15m" }
      )

      const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-signup?sellerToken=${token}`
      await sendVerificationEmail(existingUser.email, verifyUrl)

      return { ok: true, message: "Verification email sent" }
    }

    // Create new user + credentials account
    const [newUser] = await db
      .insert(user)
      .values({
        name,
        email: normalizedEmail,
        type: "SELLER",
        role: "OWNER",
      })
      .returning()

    if (!newUser) {
      throw {
        status: 500,
        error: "User creation failed.",
        toast: "Something went wrong while creating user.",
      }
    }

    await db.insert(account).values({
      userId: newUser.id,
      provider: "credentials",
      providerAccountId: generateCredentialsAccountId(),
      password: hashedPassword,
    })

    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        type: newUser.type,
      },
      process.env.SECRET_KEY as string,
      { expiresIn: "15m" }
    )

    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-signup?sellerToken=${token}`
    await sendVerificationEmail(newUser.email, verifyUrl)

    return { ok: true, message: "Verification email sent" }
  } catch (error: any) {
    console.error("User Signup Error:", error)
    return returnError(error)
  }
}
