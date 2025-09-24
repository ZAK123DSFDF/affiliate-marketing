"use server"
import { affiliate } from "@/db/schema"
import { db } from "@/db/drizzle"
import { eq, and } from "drizzle-orm"
import * as bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { returnError } from "@/lib/errorHandler"
import { InferInsertModel } from "drizzle-orm"
import { sendVerificationEmail } from "@/lib/mail"

type CreateAffiliatePayload = Omit<
  InferInsertModel<typeof affiliate>,
  "id" | "createdAt" | "updatedAt"
>

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

    const cookieStore = await cookies()

    const existingAffiliate = await db
      .select()
      .from(affiliate)
      .where(
        and(
          eq(affiliate.email, email),
          eq(affiliate.organizationId, organizationId)
        )
      )

    if (existingAffiliate.length > 0) {
      throw {
        status: 409,
        error: "Email already exists for this organization.",
        toast:
          "This email is already registered under the selected organization.",
        fields: { email: "Email already in use in this organization" },
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const [newAffiliate] = await db
      .insert(affiliate)
      .values({
        name,
        email,
        password: hashedPassword,
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
