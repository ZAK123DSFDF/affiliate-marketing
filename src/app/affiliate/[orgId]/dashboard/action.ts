"use server";

import { db } from "@/db/drizzle";
import {
  affiliate,
  affiliateLink,
  affiliateClick,
  affiliateInvoice,
} from "@/db/schema";
import { sql, eq, and, inArray } from "drizzle-orm";
import { AffiliateKpiStats } from "@/lib/types/affiliateKpiStats";
import { getOrganization } from "@/util/GetOrganization";
import { ResponseData } from "@/lib/types/response";
import { returnError } from "@/lib/errorHandler";
export async function getAffiliateKpiStats(): Promise<
  ResponseData<AffiliateKpiStats[]>
> {
  try {
    const { decoded } = await getOrganization();

    // Step 1: Get affiliate basic info
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
          eq(affiliate.id, decoded.id),
        ),
      );

    const affiliateId = affiliates[0].affiliateId;

    // Step 2: Get affiliate links
    const links = await db
      .select({ id: affiliateLink.id })
      .from(affiliateLink)
      .where(
        and(
          eq(affiliateLink.affiliateId, affiliateId),
          eq(affiliateLink.organizationId, decoded.organizationId),
        ),
      );

    const linkIds = links.map((l) => l.id);
    if (!linkIds.length) {
      const affiliateLinks = affiliates.map((a) => ({
        ...a,
        totalLinks: 0,
        totalVisitors: 0,
        totalSales: 0,
        totalCommission: 0,
        totalCommissionPaid: 0,
        totalCommissionUnpaid: 0,
        conversionRate: 0,
      }));
      return { ok: true, data: affiliateLinks };
    }

    const [clicksAgg, salesAgg] = await Promise.all([
      db
        .select({
          id: affiliateClick.affiliateLinkId,
          count: sql<number>`count(*)`.mapWith(Number),
        })
        .from(affiliateClick)
        .where(inArray(affiliateClick.affiliateLinkId, linkIds))
        .groupBy(affiliateClick.affiliateLinkId),

      db
        .select({
          id: affiliateInvoice.affiliateLinkId,
          subs: sql<number>`count(distinct ${affiliateInvoice.subscriptionId})`.mapWith(
            Number,
          ),
          singles:
            sql<number>`sum(case when ${affiliateInvoice.subscriptionId} is null then 1 else 0 end)`.mapWith(
              Number,
            ),
          totalCommission:
            sql<number>`COALESCE(SUM(${affiliateInvoice.commission}), 0)`.mapWith(
              Number,
            ),
          totalCommissionPaid:
            sql<number>`COALESCE(SUM(${affiliateInvoice.paidAmount}), 0)`.mapWith(
              Number,
            ),
          totalCommissionUnpaid:
            sql<number>`COALESCE(SUM(${affiliateInvoice.unpaidAmount}), 0)`.mapWith(
              Number,
            ),
        })
        .from(affiliateInvoice)
        .where(inArray(affiliateInvoice.affiliateLinkId, linkIds))
        .groupBy(affiliateInvoice.affiliateLinkId),
    ]);

    // Step 5: Aggregate totals in JS
    const totalVisitors = clicksAgg.reduce((sum, c) => sum + c.count, 0);
    const totalSales = salesAgg.reduce(
      (sum, s) => sum + (s.subs ?? 0) + (s.singles ?? 0),
      0,
    );
    const totalCommission = salesAgg.reduce(
      (sum, s) => sum + s.totalCommission,
      0,
    );
    const totalCommissionPaid = salesAgg.reduce(
      (sum, s) => sum + s.totalCommissionPaid,
      0,
    );
    const totalCommissionUnpaid = salesAgg.reduce(
      (sum, s) => sum + s.totalCommissionUnpaid,
      0,
    );

    const conversionRate =
      totalVisitors > 0 ? (totalSales / totalVisitors) * 100 : 0;
    const kpiStats = affiliates.map((a) => ({
      ...a,
      totalLinks: linkIds.length,
      totalVisitors,
      totalSales,
      totalCommission,
      totalCommissionPaid,
      totalCommissionUnpaid,
      conversionRate,
    }));
    return { ok: true, data: kpiStats };
  } catch (err) {
    console.error("getAffiliateLinksWithStats error:", err);
    return returnError(err) as ResponseData<AffiliateKpiStats[]>;
  }
}
