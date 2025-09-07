"use server"

import { cookies } from "next/headers"
import * as bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { db } from "@/db/drizzle"
import { returnError } from "@/lib/errorHandler"
import { sendVerificationEmail } from "@/lib/mail"

export const LoginServer = async ({
  email,
  password,
}: {
  email: string
  password: string
}) => {
  try {
    if (!email || !password) {
      throw {
        status: 400,
        error: "Email and password are required.",
        toast: "Please enter your email and password.",
        fields: {
          email: !email ? "Email is required" : "",
          password: !password ? "Password is required" : "",
        },
      }
    }
    const cookieStore = await cookies()
    // Find the user by email
    const Existuser = await db.query.user.findFirst({
      where: (u, { eq }) => eq(u.email, email),
    })

    if (!Existuser) {
      throw {
        status: 404,
        error: "User not found with this email.",
        toast: "Invalid credentials. Please check your email or password.",
        fields: { email: "User not found" },
      }
    }

    const validPassword = await bcrypt.compare(password, Existuser.password)
    if (!validPassword) {
      throw {
        status: 401,
        error: "Invalid credentials.",
        toast: "Invalid credentials. Please check your email or password.",
        fields: { password: "Invalid password" },
      }
    }

    const payload = {
      id: Existuser.id,
      email: Existuser.email,
      role: Existuser.role,
      type: Existuser.type,
    }

    const token = jwt.sign(payload, process.env.SECRET_KEY as string, {
      expiresIn: "15m",
    })

    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-login?sellerToken=${token}`
    await sendVerificationEmail(Existuser.email, verifyUrl)
    return { ok: true, message: "Verification email sent" }
  } catch (error: any) {
    console.error("Login error:", error)
    return returnError(error)
  }
}
