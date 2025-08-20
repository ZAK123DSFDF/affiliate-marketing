"use server";
import { db } from "@/db/drizzle";
import {
  affiliate,
  affiliateLink,
  affiliateClick,
  affiliateInvoice,
  organization,
} from "@/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { buildWhereWithDate } from "@/util/BuildWhereWithDate";
import { AffiliateStatsField } from "@/util/AffiliateStatFields";
import {
  buildAffiliateStatsSelect,
  ExcludableFields,
} from "@/util/BuildAffiliateStatsSelect";

type OrderableFields = "conversionRate" | "commission" | "sales";
function applyOptionalLimit<T extends { limit: (n: number) => any }>(
  q: T,
  n?: number,
) {
  return typeof n === "number" ? q.limit(n) : q;
}

export async function getAffiliatesWithStatsAction(
  orgId: string,
  year?: number,
  month?: number,
  months?: { month: number; year: number }[],
  opts?: {
    include?: AffiliateStatsField[];
    exclude?: ExcludableFields[];
    orderBy?: OrderableFields;
    orderDir?: "asc" | "desc";
    limit?: number;
  },
) {
  const selectedFields = buildAffiliateStatsSelect(opts);
  const orderExpr = (() => {
    if (!opts?.orderBy) return undefined;
    const conversionRateSql = sql`
      CASE
        WHEN COUNT(DISTINCT ${affiliateClick.id}) = 0 THEN 0
        ELSE (
          (
            COUNT(DISTINCT ${affiliateInvoice.subscriptionId})
            + COUNT(DISTINCT CASE 
                WHEN ${affiliateInvoice.subscriptionId} IS NULL 
                THEN ${affiliateInvoice.id} END
              )
          )::float / COUNT(DISTINCT ${affiliateClick.id})::float
        ) * 100
      END
    `;
    const commissionSql = sql`COALESCE(SUM(${affiliateInvoice.commission}), 0)`;
    const salesSql = sql`
      COUNT(DISTINCT ${affiliateInvoice.subscriptionId})
      + COUNT(DISTINCT CASE 
          WHEN ${affiliateInvoice.subscriptionId} IS NULL 
          THEN ${affiliateInvoice.id} END
        )
    `;

    const base =
      opts.orderBy === "conversionRate"
        ? conversionRateSql
        : opts.orderBy === "commission"
          ? commissionSql
          : salesSql;

    return opts.orderDir === "asc" ? base : desc(base);
  })();
  const chained = db
    .select(selectedFields)
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
        year,
        month,
        false,
        months,
      ),
    )
    .leftJoin(
      affiliateInvoice,
      buildWhereWithDate(
        [eq(affiliateInvoice.affiliateLinkId, affiliateLink.id)],
        affiliateInvoice,
        year,
        month,
        false,
        months,
      ),
    )
    .leftJoin(organization, eq(organization.id, orgId))
    .where(eq(affiliate.organizationId, orgId))
    .groupBy(affiliate.id, affiliate.email)
    .orderBy(...(orderExpr ? [orderExpr] : []));
  return applyOptionalLimit(chained, opts?.limit);
}
