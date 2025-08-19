import { db } from "@/db/drizzle";
import {
  affiliate,
  affiliateClick,
  affiliateInvoice,
  affiliateLink,
} from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { buildWhereWithDate } from "@/util/BuildWhereWithDate";

export async function getAffiliatePayoutBulkAction(
  orgId: string,
  months: { month: number; year: number }[],
) {
  return db
    .select({
      id: affiliate.id,
      email: affiliate.email,

      visitors: sql<number>`
        COUNT(DISTINCT ${affiliateClick.id})
      `.mapWith(Number),

      subs: sql<number>`
        COUNT(DISTINCT ${affiliateInvoice.subscriptionId})
      `.mapWith(Number),

      singles: sql<number>`
        COUNT(DISTINCT CASE 
          WHEN ${affiliateInvoice.subscriptionId} IS NULL 
          THEN ${affiliateInvoice.id} 
        END)
      `.mapWith(Number),

      sales: sql<number>`
        COUNT(DISTINCT ${affiliateInvoice.subscriptionId})
        + COUNT(DISTINCT CASE 
            WHEN ${affiliateInvoice.subscriptionId} IS NULL 
            THEN ${affiliateInvoice.id} 
          END)
      `.mapWith(Number),

      conversionRate: sql<number>`
        CASE 
          WHEN COUNT(${affiliateClick.id}) = 0 THEN 0
          ELSE (
            (
              COUNT(DISTINCT ${affiliateInvoice.subscriptionId})
              + COUNT(DISTINCT CASE 
                  WHEN ${affiliateInvoice.subscriptionId} IS NULL 
                  THEN ${affiliateInvoice.id} 
                END)
            )::float
            / COUNT(${affiliateClick.id})::float
          ) * 100
        END
      `.mapWith(Number),

      commission: sql<number>`
        COALESCE(SUM(${affiliateInvoice.commission}), 0)
      `.mapWith(Number),

      paid: sql<number>`
        COALESCE(SUM(${affiliateInvoice.paidAmount}), 0)
      `.mapWith(Number),

      unpaid: sql<number>`
        COALESCE(SUM(${affiliateInvoice.unpaidAmount}), 0)
      `.mapWith(Number),

      links: sql<string[]>`
        ARRAY_AGG(DISTINCT ${affiliateLink.id})
      `,
    })
    .from(affiliate)
    .leftJoin(
      affiliateLink,
      and(
        eq(affiliateLink.affiliateId, affiliate.id),
        eq(affiliateLink.organizationId, orgId),
      ),
    )
    .leftJoin(
      affiliateClick,
      buildWhereWithDate(
        [eq(affiliateClick.affiliateLinkId, affiliateLink.id)],
        affiliateClick,
        undefined,
        undefined,
        false,
        months,
      ),
    )
    .leftJoin(
      affiliateInvoice,
      buildWhereWithDate(
        [eq(affiliateInvoice.affiliateLinkId, affiliateLink.id)],
        affiliateInvoice,
        undefined,
        undefined,
        false,
        months,
      ),
    )
    .where(eq(affiliate.organizationId, orgId))
    .groupBy(affiliate.id, affiliate.email);
}
