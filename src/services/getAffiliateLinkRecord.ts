import { db } from "@/db/drizzle"

export const getAffiliateLinkRecord = async (code: string) => {
  const affiliateLinkRecord = await db.query.affiliateLink.findFirst({
    where: (link, { eq }) => eq(link.id, code),
  })

  if (!affiliateLinkRecord) {
    console.warn("❌ Affiliate link not found for code:", code)
    return null
  }

  return affiliateLinkRecord
}
