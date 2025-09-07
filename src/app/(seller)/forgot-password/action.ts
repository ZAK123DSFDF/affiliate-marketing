"use server"

import { db } from "@/db/drizzle"
import jwt from "jsonwebtoken"
import { returnError } from "@/lib/errorHandler"
import { sendVerificationEmail } from "@/lib/mail"

export const ForgotPasswordServer = async ({ email }: { email: string }) => {
  try {
    if (!email) {
      throw {
        status: 400,
        error: "Email is required.",
        toast: "Please enter your email.",
        fields: { email: "Email is required" },
      }
    }

    const existingUser = await db.query.user.findFirst({
      where: (u, { eq }) => eq(u.email, email),
    })

    if (!existingUser) {
      return {
        ok: true,
        message: "If the email exists, a reset link was sent.",
      }
    }

    const payload = {
      id: existingUser.id,
      email: existingUser.email,
      type: existingUser.type,
      role: existingUser.role,
      action: "reset-password",
    }

    const token = jwt.sign(payload, process.env.SECRET_KEY as string, {
      expiresIn: "15m",
    })

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?sellerToken=${token}`

    await sendVerificationEmail(existingUser.email, resetUrl)

    return { ok: true, message: "Reset link sent to your email" }
  } catch (error: any) {
    console.error("Forgot password error:", error)
    return returnError(error)
  }
}
