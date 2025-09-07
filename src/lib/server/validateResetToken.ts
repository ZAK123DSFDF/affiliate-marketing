// lib/server/validateResetToken.ts
"use server"

import jwt from "jsonwebtoken"
import { db } from "@/db/drizzle"
import { user, affiliate } from "@/db/schema"
import { eq } from "drizzle-orm"

type ValidateResetTokenProps = {
  token: string
  tokenType: "affiliate" | "seller"
}

export const validateResetToken = async ({
  token,
  tokenType,
}: ValidateResetTokenProps) => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as any

    const sessionPayload = {
      id: decoded.id,
      email: decoded.email,
      type: decoded.type,
      role: decoded.role,
      orgId: decoded.organizationId || decoded.orgId,
    }

    // Make sure the account actually exists
    if (tokenType === "seller") {
      const existingUser = await db.query.user.findFirst({
        where: eq(user.id, sessionPayload.id),
      })
      if (!existingUser) return null
    }

    if (tokenType === "affiliate") {
      const existingAffiliate = await db.query.affiliate.findFirst({
        where: eq(affiliate.id, sessionPayload.id),
      })
      if (!existingAffiliate) return null
    }

    return sessionPayload
  } catch (err) {
    console.error("Reset token validation failed:", err)
    return null
  }
}
