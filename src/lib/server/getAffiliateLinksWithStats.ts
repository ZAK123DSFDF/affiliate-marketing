"use server"
import { db } from "@/db/drizzle"
import {
  affiliate,
  affiliateClick,
  affiliateInvoice,
  affiliateLink,
  organization,
} from "@/db/schema"
import { and, desc, eq, inArray, sql } from "drizzle-orm"
import { buildWhereWithDate } from "@/util/BuildWhereWithDate"
export async function getAffiliateLinksWithStatsAction(
  decoded: {
    id: string
    organizationId: string
  },
  year?: number,
  month?: number
) {
  return db
    .select({
      id: affiliateLink.id,
      createdAt: affiliateLink.createdAt,
      clicks: sql<number>`count(distinct ${affiliateClick.id})`.mapWith(Number),
      subs: sql<number>`COUNT(DISTINCT ${affiliateInvoice.subscriptionId})`.mapWith(
        Number
      ),

      singles: sql<number>`COUNT(DISTINCT CASE 
          WHEN ${affiliateInvoice.subscriptionId} IS NULL 
          THEN ${affiliateInvoice.id} END)`.mapWith(Number),

      sales: sql<number>`(
          COUNT(DISTINCT ${affiliateInvoice.subscriptionId})
          + COUNT(DISTINCT CASE 
              WHEN ${affiliateInvoice.subscriptionId} IS NULL 
              THEN ${affiliateInvoice.id} END)
        )`.mapWith(Number),

      conversionRate: sql<number>`CASE
        WHEN COUNT(DISTINCT ${affiliateClick.id}) = 0 THEN 0
        ELSE (
          (
            COUNT(DISTINCT ${affiliateInvoice.subscriptionId})
            + COUNT(DISTINCT (
                CASE WHEN ${affiliateInvoice.subscriptionId} IS NULL
                THEN ${affiliateInvoice.id} END
              ))
          )::float
          / COUNT(DISTINCT ${affiliateClick.id})::float
        ) * 100
      END`.mapWith(Number),

      fullUrl: sql<string>`
  COALESCE(
    MIN('https://' || ${organization.domainName} || '?' || ${organization.referralParam} || '=' || ${affiliateLink.id}),
    ''
  )
`,
    })
    .from(affiliate)
    .innerJoin(
      affiliateLink,
      and(
        eq(affiliateLink.affiliateId, affiliate.id),
        eq(affiliateLink.organizationId, decoded.organizationId)
      )
    )
    .leftJoin(
      affiliateClick,
      buildWhereWithDate(
        [eq(affiliateClick.affiliateLinkId, affiliateLink.id)],
        affiliateClick,
        year,
        month
      )
    )
    .leftJoin(
      affiliateInvoice,
      buildWhereWithDate(
        [eq(affiliateInvoice.affiliateLinkId, affiliateLink.id)],
        affiliateInvoice,
        year,
        month
      )
    )
    .leftJoin(organization, eq(organization.id, affiliateLink.organizationId))
    .where(
      and(
        eq(affiliate.organizationId, decoded.organizationId),
        eq(affiliate.id, decoded.id)
      )
    )
    .groupBy(
      affiliateLink.id,
      organization.domainName,
      organization.referralParam
    )
}
