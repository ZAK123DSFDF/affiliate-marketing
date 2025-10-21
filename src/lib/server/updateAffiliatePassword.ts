"use server"

import * as bcrypt from "bcrypt"
import { db } from "@/db/drizzle"
import { affiliateAccount } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { decodedType } from "@/lib/types/decodedType"
import { returnError } from "@/lib/errorHandler"

export const updateAffiliatePasswordAction = async (
  decoded: decodedType,
  newPassword: string
) => {
  const hashed = await bcrypt.hash(newPassword, 10)

  const result = await db
    .update(affiliateAccount)
    .set({ password: hashed })
    .where(
      and(
        eq(affiliateAccount.affiliateId, decoded.id),
        eq(affiliateAccount.provider, "credentials")
      )
    )
    .returning()

  if (!result.length) {
    throw {
      status: 404,
      error: "Affiliate account not found",
      toast: "Could not update password, account missing",
    }
  }
}
