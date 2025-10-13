// app/(seller)/reset-password/action.ts
"use server"

import { db } from "@/db/drizzle"
import { account } from "@/db/schema"
import * as bcrypt from "bcrypt"
import { eq, and } from "drizzle-orm"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

export const resetSellerPasswordServer = async ({
  userId,
  password,
}: {
  userId: string
  password: string
}) => {
  try {
    const hashed = await bcrypt.hash(password, 10)

    // 🔑 Update the seller's credentials account password
    const [updatedAccount] = await db
      .update(account)
      .set({ password: hashed })
      .where(
        and(eq(account.userId, userId), eq(account.provider, "credentials"))
      )
      .returning()

    if (!updatedAccount) {
      throw new Error("Seller credentials account not found")
    }

    // 🔑 Fetch seller to normalize email & session payload
    const existingUser = await db.query.user.findFirst({
      where: (u, { eq }) => eq(u.id, userId),
    })

    if (!existingUser) {
      throw new Error("Seller not found")
    }

    // Find organizations owned by this seller
    const orgs = await db.query.organization.findMany({
      where: (org, { eq }) => eq(org.userId, existingUser.id),
    })

    const orgIds = orgs.map((o) => o.id)
    const activeOrgId = orgIds.length > 0 ? orgIds[0] : undefined

    const sessionPayload = {
      id: existingUser.id,
      email: existingUser.email,
      role: existingUser.role,
      type: existingUser.type,
      orgIds,
      activeOrgId,
    }

    // Sign JWT & set cookie
    const sessionToken = jwt.sign(sessionPayload, process.env.SECRET_KEY!, {
      expiresIn: "7d",
    })

    const cookieStore = await cookies()
    cookieStore.set("sellerToken", sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })

    return {
      ok: true,
      redirectUrl: `/seller/${activeOrgId}/dashboard/analytics`,
    }
  } catch (err) {
    console.error("Reset seller password failed:", err)
    return { ok: false, error: "Failed to reset password" }
  }
}
