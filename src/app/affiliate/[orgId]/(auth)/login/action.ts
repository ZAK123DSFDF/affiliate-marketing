"use server"

import { db } from "@/db/drizzle"
import * as bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { returnError } from "@/lib/errorHandler"
import { sendVerificationEmail } from "@/lib/mail"
export const LoginAffiliateServer = async ({
  email,
  password,
  organizationId,
  rememberMe = false,
}: {
  email: string
  password: string
  organizationId: string
  rememberMe?: boolean
}) => {
  try {
    if (!email || !password || !organizationId) {
      throw {
        status: 400,
        error: "Email, password, and organization ID are required.",
        toast: "Please enter your login credentials.",
        fields: {
          email: !email ? "Email is required" : "",
          password: !password ? "Password is required" : "",
          organizationId: !organizationId ? "Organization is required" : "",
        },
      }
    }

    // Find the affiliate by organization and email
    const existingAffiliate = await db.query.affiliate.findFirst({
      where: (a, { and, eq }) =>
        and(eq(a.email, email), eq(a.organizationId, organizationId)),
    })

    if (!existingAffiliate) {
      throw {
        status: 404,
        error: "Affiliate not found.",
        toast:
          "Invalid credentials. Please check your email, password, and organization.",
        fields: { email: "Affiliate not found in this organization" },
      }
    }

    // Find the affiliate account with provider = 'credentials'
    const affiliateAcc = await db.query.affiliateAccount.findFirst({
      where: (aa, { and, eq }) =>
        and(
          eq(aa.affiliateId, existingAffiliate.id),
          eq(aa.provider, "credentials")
        ),
    })

    if (!affiliateAcc || !affiliateAcc.password) {
      throw {
        status: 401,
        error: "Affiliate account not found.",
        toast: "Invalid credentials. No password found for this affiliate.",
      }
    }

    const validPassword = await bcrypt.compare(password, affiliateAcc.password)

    if (!validPassword) {
      throw {
        status: 401,
        error: "Invalid password.",
        toast: "Invalid credentials. Please check your password.",
        fields: { password: "Invalid password" },
      }
    }

    const token = jwt.sign(
      {
        id: existingAffiliate.id,
        email: existingAffiliate.email,
        type: existingAffiliate.type,
        organizationId: existingAffiliate.organizationId,
        rememberMe,
      },
      process.env.SECRET_KEY as string,
      { expiresIn: "15m" }
    )

    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/affiliate/${organizationId}/verify-login?affiliateToken=${token}`
    if (process.env.NODE_ENV === "development") {
      await sendVerificationEmail(existingAffiliate.email, verifyUrl)
      return {
        ok: true,
        message: "Verification email sent",
        redirectUrl: `/affiliate/${organizationId}/checkEmail`,
      }
    }
    return { ok: true, redirectUrl: verifyUrl }
  } catch (error: any) {
    console.error("Affiliate Login Error:", error)
    return returnError(error)
  }
}
