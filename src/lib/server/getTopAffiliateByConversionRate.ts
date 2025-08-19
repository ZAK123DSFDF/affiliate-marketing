"use server";
import { db } from "@/db/drizzle";
import {
  affiliate,
  affiliateClick,
  affiliateInvoice,
  affiliateLink,
} from "@/db/schema";
import { desc, eq, inArray, sql } from "drizzle-orm";
import { buildWhereWithDate } from "@/util/BuildWhereWithDate";

export async function getTopAffiliatesByConversionRate(
  linkIds: string[],
  year?: number,
  month?: number,
  months?: { month: number; year: number }[],
) {
  const raw = await db
    .select({
      id: affiliate.id,
      email: affiliate.email,
      links: sql<string[]>`ARRAY_AGG(DISTINCT ${affiliateLink.id})`,
      visitors: sql<number>`COUNT(DISTINCT ${affiliateClick.id})`.mapWith(
        Number,
      ),
      subs: sql<number>`
  COUNT(DISTINCT ${affiliateInvoice.subscriptionId})
`.mapWith(Number),

      singles: sql<number>`
  COUNT(DISTINCT CASE WHEN ${affiliateInvoice.subscriptionId} IS NULL THEN ${affiliateInvoice.id} END)
`.mapWith(Number),

      sales: sql<number>`
  COUNT(DISTINCT ${affiliateInvoice.subscriptionId}) 
  + COUNT(DISTINCT CASE WHEN ${affiliateInvoice.subscriptionId} IS NULL THEN ${affiliateInvoice.id} END)
`.mapWith(Number),
      commission:
        sql<number>`COALESCE(SUM(${affiliateInvoice.commission}), 0)`.mapWith(
          Number,
        ),
      paid: sql<number>`COALESCE(SUM(${affiliateInvoice.paidAmount}), 0)`.mapWith(
        Number,
      ),
      unpaid:
        sql<number>`COALESCE(SUM(${affiliateInvoice.unpaidAmount}), 0)`.mapWith(
          Number,
        ),
      conversionRate: sql<number>`
        CASE 
          WHEN COUNT(${affiliateClick.id}) = 0 THEN 0
          ELSE (COUNT(DISTINCT ${affiliateInvoice.id})::float / COUNT(${affiliateClick.id})::float) * 100
        END
      `.mapWith(Number),
    })
    .from(affiliate)
    .leftJoin(affiliateLink, eq(affiliateLink.affiliateId, affiliate.id))
    .leftJoin(
      affiliateClick,
      eq(affiliateClick.affiliateLinkId, affiliateLink.id),
    )
    .leftJoin(
      affiliateInvoice,
      eq(affiliateInvoice.affiliateLinkId, affiliateLink.id),
    )
    .where(
      buildWhereWithDate(
        [inArray(affiliateLink.id, linkIds)],
        affiliateClick,
        year,
        month,
        false,
        months,
      ),
    )
    .groupBy(affiliate.id, affiliate.email)
    .orderBy(
      desc(
        sql<number>`
      CASE 
        WHEN COUNT(${affiliateClick.id}) = 0 THEN 0
        ELSE (COUNT(DISTINCT ${affiliateInvoice.id})::float / COUNT(${affiliateClick.id})::float) * 100
      END
    `,
      ),
    )
    .limit(10);
  console.log("getTopAffiliatesByConversionRate", raw);
  return raw;
}
