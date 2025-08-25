"use server"
import { db } from "@/db/drizzle"
import { and, eq, sql } from "drizzle-orm"
import {
  affiliate,
  affiliateClick,
  affiliateInvoice,
  affiliateLink,
} from "@/db/schema"
import { buildWhereWithDate } from "@/util/BuildWhereWithDate"
export async function getAffiliateKpiStatsAction(
  orgId: string,
  affiliateId: string,
  year?: number,
  month?: number
) {
  return db
    .select({
      totalLinks: sql<number>`COUNT(DISTINCT ${affiliateLink.id})`.mapWith(
        Number
      ),

      totalVisitors: sql<number>`COUNT(DISTINCT ${affiliateClick.id})`.mapWith(
        Number
      ),

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

      commission:
        sql<number>`COALESCE(SUM(${affiliateInvoice.commission}),0)`.mapWith(
          Number
        ),
      paid: sql<number>`COALESCE(SUM(${affiliateInvoice.paidAmount}),0)`.mapWith(
        Number
      ),
      unpaid:
        sql<number>`COALESCE(SUM(${affiliateInvoice.unpaidAmount}),0)`.mapWith(
          Number
        ),
      amount: sql<number>`COALESCE(SUM(${affiliateInvoice.amount}),0)`.mapWith(
        Number
      ),
    })
    .from(affiliate)
    .innerJoin(affiliateLink, eq(affiliateLink.affiliateId, affiliate.id))
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
    .where(
      and(eq(affiliate.organizationId, orgId), eq(affiliate.id, affiliateId))
    )
}
