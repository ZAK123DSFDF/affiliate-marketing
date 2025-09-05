"use server"
import { user } from "@/db/schema" // Renamed 'user' to 'users' for clarity and to avoid conflict
import { eq } from "drizzle-orm"
import { db } from "@/db/drizzle"
import * as bcrypt from "bcrypt"
import jwt from "jsonwebtoken" // <--- Add this import!
import { InferInsertModel } from "drizzle-orm"
import { cookies } from "next/headers"
import { returnError } from "@/lib/errorHandler"
import { sendVerificationEmail } from "@/lib/mail" // Recommended for type safety

// Define the type for user creation using Drizzle's InferInsertModel
type CreateUserPayload = InferInsertModel<typeof user>

export const SignupServer = async ({
  name,
  email,
  password,
}: CreateUserPayload) => {
  // Use the defined type
  try {
    if (!email || !password || !name) {
      throw {
        status: 400,
        error: "Email, password, and name are required",
        toast: "Please fill in all required fields.",
        fields: {
          email: !email ? "Email is required" : "",
          password: !password ? "Password is required" : "",
          name: !name ? "Name is required" : "",
        },
      }
    }
    const cookieStore = await cookies()
    // Check if user already exists
    const existingUser = await db
      .select()
      .from(user) // Use 'users' from schema
      .where(eq(user.email, email))

    if (existingUser.length > 0) {
      throw {
        status: 409, // Conflict
        error: "Email already exists",
        toast: "This email is already registered. Please try logging in.",
        fields: { email: "This email is already in use" },
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert new user
    const [newUser] = await db
      .insert(user) // Use 'users' from schema
      .values({
        name,
        email,
        password: hashedPassword,
        type: "SELLER",
      })
      .returning()

    // Ensure a user was actually created and returned
    if (!newUser) {
      throw {
        status: 500,
        error: "Failed to create user.",
        toast: "Something went wrong during user creation. Please try again.",
      }
    }

    // Create JWT token
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

    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-signup?sellerToken=${token}`
    await sendVerificationEmail(newUser.email, verifyUrl)

    return { ok: true, message: "Verification email sent" }
  } catch (error: any) {
    console.error("Signup error:", error) // Log the full error for debugging
    return returnError(error)
  }
}
