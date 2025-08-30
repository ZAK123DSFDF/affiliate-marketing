"use server"
import { db } from "@/db/drizzle"
import { affiliate, affiliatePayoutMethod } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import { decodedType } from "@/lib/types/decodedType"

export const updateAffiliateProfileAction = async (
  decoded: decodedType,
  data: { name?: string; email?: string; paypalEmail?: string }
) => {
  if (data.name || data.email) {
    await db
      .update(affiliate)
      .set({
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
      })
      .where(eq(affiliate.id, decoded.id))
  }

  if (data.paypalEmail) {
    const existing = await db.query.affiliatePayoutMethod.findFirst({
      where: and(
        eq(affiliatePayoutMethod.affiliateId, decoded.id),
        eq(affiliatePayoutMethod.provider, "paypal")
      ),
    })

    if (existing) {
      await db
        .update(affiliatePayoutMethod)
        .set({ accountIdentifier: data.paypalEmail, updatedAt: new Date() })
        .where(eq(affiliatePayoutMethod.id, existing.id))
    } else {
      await db.insert(affiliatePayoutMethod).values({
        affiliateId: decoded.id,
        provider: "paypal",
        accountIdentifier: data.paypalEmail,
        isDefault: true,
      })
    }
  }
}
