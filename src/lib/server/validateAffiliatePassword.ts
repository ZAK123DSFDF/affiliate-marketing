"use server"

import { db } from "@/db/drizzle"
import { eq, and } from "drizzle-orm"
import { affiliateAccount } from "@/db/schema"
import * as bcrypt from "bcrypt"
import { decodedType } from "@/lib/types/decodedType"
import { returnError } from "@/lib/errorHandler"

export const validateAffiliatePasswordAction = async (
  decoded: decodedType,
  currentPassword: string
) => {
  try {
    const account = await db.query.affiliateAccount.findFirst({
      where: and(
        eq(affiliateAccount.affiliateId, decoded.id),
        eq(affiliateAccount.provider, "credentials")
      ),
    })

    if (!account || !account.password) {
      throw {
        status: 404,
        error: "Affiliate account not found",
        toast: "Account not found",
      }
    }

    const isMatch = await bcrypt.compare(currentPassword, account.password)
    if (!isMatch) {
      throw {
        status: 403,
        error: "Incorrect current password",
        toast: "Incorrect current password",
      }
    }

    return { ok: true }
  } catch (error: any) {
    console.error("Validate Affiliate Password Error:", error)
    return returnError(error)
  }
}
