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

    const orgs = await db.query.organization.findMany({
      where: (org, { eq }) => eq(org.userId, existingUser.id),
    })

    const orgIds = orgs.map((o) => o.id)
    const activeOrgId = orgIds.length > 0 ? orgIds[0] : undefined
    const payload = {
      id: existingUser.id,
      email: existingUser.email,
      type: existingUser.type,
      role: existingUser.role,
      orgIds,
      activeOrgId,
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
