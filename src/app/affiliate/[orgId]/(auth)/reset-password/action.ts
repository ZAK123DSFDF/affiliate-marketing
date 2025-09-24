// app/affiliate/[orgId]/reset-password/action.ts
"use server"

import { db } from "@/db/drizzle"
import { affiliate } from "@/db/schema"
import * as bcrypt from "bcrypt"
import { eq, and } from "drizzle-orm"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

export const resetAffiliatePasswordServer = async ({
  affiliateId,
  orgId,
  password,
}: {
  affiliateId: string
  orgId: string
  password: string
}) => {
  try {
    const hashed = await bcrypt.hash(password, 10)

    const [updatedAffiliate] = await db
      .update(affiliate)
      .set({ password: hashed })
      .where(
        and(eq(affiliate.id, affiliateId), eq(affiliate.organizationId, orgId))
      )
      .returning()

    if (!updatedAffiliate) {
      throw new Error("Affiliate not found")
    }

    // Create session payload
    const sessionPayload = {
      id: updatedAffiliate.id,
      email: updatedAffiliate.email,
      type: updatedAffiliate.type,
      orgId: updatedAffiliate.organizationId,
    }

    // Sign JWT & set cookie
    const sessionToken = jwt.sign(sessionPayload, process.env.SECRET_KEY!, {
      expiresIn: "7d",
    })

    const cookieStore = await cookies()
    cookieStore.set(`affiliateToken-${orgId}`, sessionToken, { httpOnly: true })

    return { ok: true }
  } catch (err) {
    console.error("Reset affiliate password failed:", err)
    return { ok: false, error: "Failed to reset password" }
  }
}
