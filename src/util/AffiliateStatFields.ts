import { sql } from "drizzle-orm";
import {
  affiliate,
  affiliateClick,
  affiliateInvoice,
  affiliateLink,
  organization,
} from "@/db/schema";

export const affiliateStatsFields = {
  id: affiliate.id,
  email: affiliate.email,

  visitors: sql<number>`COUNT(DISTINCT ${affiliateClick.id})`.mapWith(Number),

  subs: sql<number>`COUNT(DISTINCT ${affiliateInvoice.subscriptionId})`.mapWith(
    Number,
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

  links: sql<string[]>`
    ARRAY_AGG(
      DISTINCT ('https://' || ${organization.domainName} || '?' || ${organization.referralParam} || '=' || ${affiliateLink.id})
    )
  `,
};

export type AffiliateStatsField = keyof typeof affiliateStatsFields;
