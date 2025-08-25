"use server"
import { db } from "@/db/drizzle"
import { generateAffiliateCode } from "@/util/idGenerators"
import { affiliateLink } from "@/db/schema"

export const createFullUrl = async (decoded: {
  id: string
  organizationId: string
}) => {
  const org = await db.query.organization.findFirst({
    where: (o, { eq }) => eq(o.id, decoded.organizationId),
  })
  if (!org) throw new Error("Organization not found")
  const code = generateAffiliateCode() // e.g., "7hjKpQ"
  const param = org.referralParam
  const domain = org.domainName.replace(/^https?:\/\//, "")

  const fullUrl = `https://${domain}/?${param}=${code}`

  await db.insert(affiliateLink).values({
    id: code,
    affiliateId: decoded.id,
    organizationId: decoded.organizationId,
  })
  return { org, fullUrl }
}
