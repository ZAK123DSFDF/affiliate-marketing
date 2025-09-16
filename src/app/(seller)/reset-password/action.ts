// app/(seller)/reset-password/action.ts
"use server"

import { db } from "@/db/drizzle"
import { user } from "@/db/schema"
import * as bcrypt from "bcrypt"
import { eq } from "drizzle-orm"
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

    const [updatedUser] = await db
      .update(user)
      .set({ password: hashed })
      .where(eq(user.id, userId))
      .returning()

    if (!updatedUser) {
      throw new Error("User not found")
    }
    const orgs = await db.query.organization.findMany({
      where: (org, { eq }) => eq(org.userId, updatedUser.id),
    })

    const orgIds = orgs.map((o) => o.id)
    const activeOrgId = orgIds.length > 0 ? orgIds[0] : undefined

    const sessionPayload = {
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
      type: updatedUser.type,
      orgIds,
      activeOrgId,
    }

    // Sign JWT & set cookie
    const sessionToken = jwt.sign(sessionPayload, process.env.SECRET_KEY!, {
      expiresIn: "7d",
    })

    const cookieStore = await cookies()
    cookieStore.set("sellerToken", sessionToken, { httpOnly: true })

    return { ok: true }
  } catch (err) {
    console.error("Reset seller password failed:", err)
    return { ok: false, error: "Failed to reset password" }
  }
}
