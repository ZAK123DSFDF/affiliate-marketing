"use server";
import { returnError } from "@/lib/errorHandler";
import { affiliateClick, affiliateInvoice } from "@/db/schema";
import { inArray, sql } from "drizzle-orm";
import { buildWhereWithDate } from "@/util/BuildWhereWithDate";
import { db } from "@/db/drizzle";
import { getOrgAuth } from "@/lib/server/GetOrgAuth";
import { getOrgAffiliateLinks } from "@/lib/server/GetOrgAffiliateLinks";
import { ResponseData } from "@/lib/types/response";
import { SellerKpiStats } from "@/lib/types/affiliateKpiStats";
import { SellerKpiTimeSeries } from "@/lib/types/affiliateChartStats";
import { getTimeSeriesData } from "@/lib/server/getTimeSeriesData";
import { SellerReferrerStat } from "@/lib/types/affiliateReferrerStat";
import { getReferrerStats } from "@/lib/server/getReferrerStats";
import { AffiliateStats } from "@/lib/types/affiliateStats";
import { getTopAffiliatesByConversionRate } from "@/lib/server/getTopAffiliateByConversionRate";
export async function getSellerKpiStats(
  orgId: string,
  Year?: number,
  month?: number,
): Promise<ResponseData<SellerKpiStats[]>> {
  try {
    const org = await getOrgAuth(orgId);
    const { linkIds, affRows } = await getOrgAffiliateLinks(org, orgId);
    const [clickAgg, invoiceAgg] = await Promise.all([
      db
        .select({
          linkId: affiliateClick.affiliateLinkId,
          visits: sql<number>`count(*)`.mapWith(Number),
        })
        .from(affiliateClick)
        .where(
          buildWhereWithDate(
            [inArray(affiliateClick.affiliateLinkId, linkIds)],
            affiliateClick,
            Year,
            month,
          ),
        )
        .groupBy(affiliateClick.affiliateLinkId),

      db
        .select({
          linkId: affiliateInvoice.affiliateLinkId,
          subs: sql<number>`count(distinct ${affiliateInvoice.subscriptionId})`.mapWith(
            Number,
          ),
          singles:
            sql<number>`sum(case when ${affiliateInvoice.subscriptionId} is null then 1 else 0 end)`.mapWith(
              Number,
            ),
          commission:
            sql<number>`coalesce(sum(${affiliateInvoice.commission}), 0)`.mapWith(
              Number,
            ),

          paid: sql<number>`coalesce(sum(${affiliateInvoice.paidAmount}), 0)`.mapWith(
            Number,
          ),

          unpaid:
            sql<number>`coalesce(sum(${affiliateInvoice.unpaidAmount}), 0)`.mapWith(
              Number,
            ),
          amount:
            sql<number>`coalesce(sum(${affiliateInvoice.amount}), 0)`.mapWith(
              Number,
            ),
        })
        .from(affiliateInvoice)
        .where(
          buildWhereWithDate(
            [inArray(affiliateInvoice.affiliateLinkId, linkIds)],
            affiliateInvoice,
            Year,
            month,
          ),
        )
        .groupBy(affiliateInvoice.affiliateLinkId),
    ]);
    const totalVisitors = clickAgg.reduce((acc, c) => acc + c.visits, 0);
    const totalSales = invoiceAgg.reduce(
      (acc, inv) => acc + inv.subs + inv.singles,
      0,
    );
    const totalCommission = invoiceAgg.reduce(
      (acc, inv) => acc + inv.commission,
      0,
    );
    const totalCommissionPaid = invoiceAgg.reduce(
      (acc, inv) => acc + inv.paid,
      0,
    );
    const totalCommissionUnpaid = invoiceAgg.reduce(
      (acc, inv) => acc + inv.unpaid,
      0,
    );
    const totalAmount = invoiceAgg.reduce((acc, inv) => acc + inv.amount, 0);
    const sellerKpiStats = {
      totalAffiliates: affRows.length,
      totalLinks: linkIds.length,
      totalVisitors,
      totalSales,
      totalCommission,
      totalCommissionPaid,
      totalCommissionUnpaid,
      totalAmount,
    };
    return { ok: true, data: [sellerKpiStats] };
  } catch (err) {
    console.error("Error fetching seller KPI stats:", err);
    return returnError(err) as ResponseData<SellerKpiStats[]>;
  }
}
export async function getSellerKpiTimeSeries(
  orgId: string,
  year?: number,
  month?: number,
): Promise<ResponseData<SellerKpiTimeSeries[]>> {
  try {
    const org = await getOrgAuth(orgId);
    const { linkIds } = await getOrgAffiliateLinks(org, orgId);
    if (!linkIds.length) return { ok: true, data: [] };
    const data = await getTimeSeriesData<SellerKpiTimeSeries>(
      linkIds,
      year,
      month,
    );
    return { ok: true, data };
  } catch (err) {
    console.error("Error fetching seller KPI time series:", err);
    return returnError(err) as ResponseData<SellerKpiTimeSeries[]>;
  }
}
export async function getSellerReferrer(
  orgId: string,
  year?: number,
  month?: number,
): Promise<ResponseData<SellerReferrerStat[]>> {
  try {
    const org = await getOrgAuth(orgId);
    const { linkIds } = await getOrgAffiliateLinks(org, orgId);
    const referrerStats = await getReferrerStats(linkIds, year, month);
    return { ok: true, data: referrerStats };
  } catch (err) {
    console.error("Error fetching seller referrer:", err);
    return returnError(err) as ResponseData<SellerReferrerStat[]>;
  }
}
export async function getTopAffiliates(
  orgId: string,
  year?: number,
  month?: number,
): Promise<ResponseData<AffiliateStats[]>> {
  try {
    await getOrgAuth(orgId);
    const TopAffiliateStats = await getTopAffiliatesByConversionRate(
      orgId,
      year,
      month,
    );
    return { ok: true, data: TopAffiliateStats };
  } catch (err) {
    console.error("Error fetching top affiliates:", err);
    return returnError(err) as ResponseData<AffiliateStats[]>;
  }
}
