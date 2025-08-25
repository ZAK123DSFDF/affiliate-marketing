"use server"
import { db } from "@/db/drizzle"
import { affiliate, affiliateLink } from "@/db/schema"
import { and, eq } from "drizzle-orm"

export async function getAffiliateLinks(decoded: {
  organizationId: string
  id: string
}) {
  const affiliates = await db
    .select({
      affiliateId: affiliate.id,
      name: affiliate.name,
      email: affiliate.email,
    })
    .from(affiliate)
    .where(
      and(
        eq(affiliate.organizationId, decoded.organizationId),
        eq(affiliate.id, decoded.id)
      )
    )

  if (!affiliates.length) return { affiliates: [], linkIds: [] }

  const affiliateId = affiliates[0].affiliateId

  const links = await db
    .select({ id: affiliateLink.id, createdAt: affiliateLink.createdAt })
    .from(affiliateLink)
    .where(
      and(
        eq(affiliateLink.affiliateId, affiliateId),
        eq(affiliateLink.organizationId, decoded.organizationId)
      )
    )

  return { affiliates, linkIds: links.map((l) => l.id), links }
}
