"use server"

import { affiliate, affiliateAccount } from "@/db/schema"
import { db } from "@/db/drizzle"
import * as bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { returnError } from "@/lib/errorHandler"
import { sendVerificationEmail } from "@/lib/mail"
import { customAlphabet } from "nanoid"

type CreateAffiliatePayload = {
  name: string
  email: string
  password: string
  organizationId: string
}

// 6-digit alphanumeric ID generator for credentials provider accounts
const generateCredentialsAccountId = customAlphabet("0123456789", 6)

export const SignupAffiliateServer = async ({
  name,
  email,
  password,
  organizationId,
}: CreateAffiliatePayload) => {
  try {
    if (!email || !password || !name || !organizationId) {
      throw {
        status: 400,
        error: "Missing required fields.",
        toast: "Please fill in all required fields.",
        fields: {
          email: !email ? "Email is required" : "",
          password: !password ? "Password is required" : "",
          name: !name ? "Name is required" : "",
          organizationId: !organizationId ? "Organization is required" : "",
        },
      }
    }
    const normalizedEmail = email.trim().toLowerCase()
    const existingAffiliate = await db.query.affiliate.findFirst({
      where: (a, { and, eq }) =>
        and(eq(a.email, normalizedEmail), eq(a.organizationId, organizationId)),
    })

    const hashedPassword = await bcrypt.hash(password, 10)

    if (existingAffiliate) {
      // Check if they already have a credentials account
      const existingAcc = await db.query.affiliateAccount.findFirst({
        where: (aa, { and, eq }) =>
          and(
            eq(aa.affiliateId, existingAffiliate.id),
            eq(aa.provider, "credentials")
          ),
      })

      if (existingAcc) {
        throw {
          status: 409,
          error: "Affiliate already exists.",
          toast:
            "This email is already registered with credentials under this organization.",
          fields: { email: "Email already in use" },
        }
      }

      // Add new credentials account under existing affiliate
      await db.insert(affiliateAccount).values({
        affiliateId: existingAffiliate.id,
        provider: "credentials",
        providerAccountId: generateCredentialsAccountId(),
        password: hashedPassword,
      })

      const token = jwt.sign(
        {
          id: existingAffiliate.id,
          email: existingAffiliate.email,
          type: existingAffiliate.type,
          organizationId: existingAffiliate.organizationId,
        },
        process.env.SECRET_KEY as string,
        { expiresIn: "15m" }
      )

      const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/affiliate/${organizationId}/verify-signup?affiliateToken=${token}`
      await sendVerificationEmail(existingAffiliate.email, verifyUrl)

      return { ok: true, message: "Verification email sent" }
    }

    // Create new affiliate + credentials account
    const [newAffiliate] = await db
      .insert(affiliate)
      .values({
        name,
        email: normalizedEmail,
        type: "AFFILIATE",
        organizationId,
      })
      .returning()

    if (!newAffiliate) {
      throw {
        status: 500,
        error: "Affiliate creation failed.",
        toast: "Something went wrong while creating affiliate.",
      }
    }

    await db.insert(affiliateAccount).values({
      affiliateId: newAffiliate.id,
      provider: "credentials",
      providerAccountId: generateCredentialsAccountId(),
      password: hashedPassword,
    })

    const token = jwt.sign(
      {
        id: newAffiliate.id,
        email: newAffiliate.email,
        type: newAffiliate.type,
        organizationId: newAffiliate.organizationId,
      },
      process.env.SECRET_KEY as string,
      { expiresIn: "15m" }
    )

    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/affiliate/${organizationId}/verify-signup?affiliateToken=${token}`
    await sendVerificationEmail(newAffiliate.email, verifyUrl)

    return { ok: true, message: "Verification email sent" }
  } catch (error: any) {
    console.error("Affiliate Signup Error:", error)
    return returnError(error)
  }
}
