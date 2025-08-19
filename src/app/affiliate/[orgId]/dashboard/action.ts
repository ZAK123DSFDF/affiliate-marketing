"use server";

import { db } from "@/db/drizzle";
import { affiliateClick, affiliateInvoice } from "@/db/schema";
import { sql, inArray } from "drizzle-orm";
import { AffiliateKpiStats } from "@/lib/types/affiliateKpiStats";
import { getAffiliateOrganization } from "@/lib/server/GetAffiliateOrganization";
import { ResponseData } from "@/lib/types/response";
import { returnError } from "@/lib/errorHandler";
import { AffiliateReferrerStat } from "@/lib/types/affiliateReferrerStat";
import { AffiliateKpiTimeSeries } from "@/lib/types/affiliateChartStats";
import { buildWhereWithDate } from "@/util/BuildWhereWithDate";
import { getAffiliateLinks } from "@/lib/server/getAffiliateLinks";
import { getTimeSeriesData } from "@/lib/server/getTimeSeriesData";
import { getReferrerStats } from "@/lib/server/getReferrerStats";

export async function getAffiliateKpiStats(
  year?: number,
  month?: number,
): Promise<ResponseData<AffiliateKpiStats[]>> {
  try {
    const { decoded } = await getAffiliateOrganization();
    const { affiliates, linkIds } = await getAffiliateLinks(decoded);
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
        .where(
          buildWhereWithDate(
            [inArray(affiliateClick.affiliateLinkId, linkIds)],
            affiliateClick,
            year,
            month,
          ),
        )
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
        .where(
          buildWhereWithDate(
            [inArray(affiliateInvoice.affiliateLinkId, linkIds)],
            affiliateInvoice,
            year,
            month,
          ),
        )
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
export async function getAffiliateKpiTimeSeries(
  year?: number,
  month?: number,
): Promise<ResponseData<AffiliateKpiTimeSeries[]>> {
  try {
    const { decoded } = await getAffiliateOrganization();
    const { linkIds } = await getAffiliateLinks(decoded);
    if (!linkIds.length) return { ok: true, data: [] };

    const data = await getTimeSeriesData<AffiliateKpiTimeSeries>(
      linkIds,
      year,
      month,
    );

    return { ok: true, data };
  } catch (err) {
    return returnError(err) as ResponseData<AffiliateKpiTimeSeries[]>;
  }
}

export async function getAffiliateReferrers(
  year?: number,
  month?: number,
): Promise<ResponseData<AffiliateReferrerStat[]>> {
  try {
    const { decoded } = await getAffiliateOrganization();

    const { linkIds } = await getAffiliateLinks(decoded);
    if (!linkIds.length) return { ok: true, data: [] };
    const referrerStats = await getReferrerStats(linkIds, year, month);

    return { ok: true, data: referrerStats };
  } catch (err) {
    console.error("getAffiliateReferrers error:", err);
    return returnError(err) as ResponseData<AffiliateReferrerStat[]>;
  }
}
