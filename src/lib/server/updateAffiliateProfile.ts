"use server"
import { db } from "@/db/drizzle"
import { affiliate, affiliatePayoutMethod } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import { decodedType } from "@/lib/types/decodedType"

export const updateAffiliateProfileAction = async (
  decoded: decodedType,
  {
    name,
    email,
    paypalEmail,
  }: { name?: string; email?: string; paypalEmail?: string }
) => {
  const updates: Partial<{ name: string; email: string }> = {}
  if (name) updates.name = name
  if (email) updates.email = email

  if (Object.keys(updates).length > 0) {
    await db.update(affiliate).set(updates).where(eq(affiliate.id, decoded.id))
  }

  if (paypalEmail) {
    const existing = await db.query.affiliatePayoutMethod.findFirst({
      where: and(
        eq(affiliatePayoutMethod.affiliateId, decoded.id),
        eq(affiliatePayoutMethod.provider, "paypal")
      ),
    })

    if (existing) {
      await db
        .update(affiliatePayoutMethod)
        .set({ accountIdentifier: paypalEmail, updatedAt: new Date() })
        .where(eq(affiliatePayoutMethod.id, existing.id))
    } else {
      await db.insert(affiliatePayoutMethod).values({
        affiliateId: decoded.id,
        provider: "paypal",
        accountIdentifier: paypalEmail,
        isDefault: true,
      })
    }
  }
}
