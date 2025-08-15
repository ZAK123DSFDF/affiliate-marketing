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
import { AffiliateReferrerStat } from "@/lib/types/affiliateReferrerStat";
import { AffiliateKpiTimeSeries } from "@/lib/types/affiliateChartStats";
import { AffiliateLinkWithStats } from "@/lib/types/affiliateLinkWithStats";
async function getAffiliateLinks(decoded: {
  organizationId: string;
  id: string;
}) {
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

  if (!affiliates.length) return { affiliates: [], linkIds: [] };

  const affiliateId = affiliates[0].affiliateId;

  const links = await db
    .select({ id: affiliateLink.id })
    .from(affiliateLink)
    .where(
      and(
        eq(affiliateLink.affiliateId, affiliateId),
        eq(affiliateLink.organizationId, decoded.organizationId),
      ),
    );

  return { affiliates, linkIds: links.map((l) => l.id) };
}

export async function getAffiliateKpiStats(): Promise<
  ResponseData<AffiliateKpiStats[]>
> {
  try {
    const { decoded } = await getOrganization();
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
export async function getAffiliateKpiTimeSeries(): Promise<
  ResponseData<AffiliateKpiTimeSeries[]>
> {
  try {
    const { decoded } = await getOrganization();
    const { linkIds } = await getAffiliateLinks(decoded);
    if (!linkIds.length) return { ok: true, data: [] };

    const [clicksAgg, salesAgg] = await Promise.all([
      db
        .select({
          id: affiliateClick.affiliateLinkId,
          createdAt: affiliateClick.createdAt,
          count: sql<number>`count(*)`.mapWith(Number),
        })
        .from(affiliateClick)
        .where(inArray(affiliateClick.affiliateLinkId, linkIds))
        .groupBy(affiliateClick.createdAt, affiliateClick.affiliateLinkId),

      db
        .select({
          id: affiliateInvoice.affiliateLinkId,
          createdAt: affiliateInvoice.createdAt,
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
        })
        .from(affiliateInvoice)
        .where(inArray(affiliateInvoice.affiliateLinkId, linkIds))
        .groupBy(affiliateInvoice.createdAt, affiliateInvoice.affiliateLinkId),
    ]);

    const chartData = clicksAgg.map((click) => {
      const sameDaySales = salesAgg.find(
        (sale) => sale.id === click.id && sale.createdAt === click.createdAt,
      );
      return {
        createdAt: click.createdAt.toISOString().slice(0, 10),
        visitors: click.count,
        sales: sameDaySales ? sameDaySales.subs + sameDaySales.singles : 0,
        totalCommission: sameDaySales ? sameDaySales.totalCommission : 0,
      };
    });

    return { ok: true, data: chartData };
  } catch (err) {
    return returnError(err) as ResponseData<AffiliateKpiTimeSeries[]>;
  }
}

export async function getAffiliateReferrers(): Promise<
  ResponseData<AffiliateReferrerStat[]>
> {
  try {
    const { decoded } = await getOrganization();

    // Step 1: Find affiliate for current user/org
    const affiliates = await db
      .select({ affiliateId: affiliate.id })
      .from(affiliate)
      .where(
        and(
          eq(affiliate.organizationId, decoded.organizationId),
          eq(affiliate.id, decoded.id),
        ),
      );

    if (!affiliates.length) {
      return { ok: true, data: [] };
    }

    const affiliateId = affiliates[0].affiliateId;

    // Step 2: Get all affiliate link IDs for that affiliate
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
      return { ok: true, data: [] };
    }

    // Step 3: Aggregate referrer stats for only these links
    const referrerStats = await db
      .select({
        referrer: affiliateClick.referrer,
        clicks: sql<number>`COUNT(*)`.mapWith(Number),
      })
      .from(affiliateClick)
      .where(inArray(affiliateClick.affiliateLinkId, linkIds))
      .groupBy(affiliateClick.referrer);

    return { ok: true, data: referrerStats };
  } catch (err) {
    console.error("getAffiliateReferrers error:", err);
    return { ok: false, error: "Failed to fetch referrer stats", status: 500 };
  }
}
export const getTopPerformingAffiliateLinks = async (): Promise<
  ResponseData<AffiliateLinkWithStats[]>
> => {
  try {
    const { org, decoded } = await getOrganization();
    const baseDomain = org.domainName.replace(/^https?:\/\//, "");
    const param = org.referralParam;

    const rows = await db
      .select({
        id: affiliateLink.id,
        createdAt: affiliateLink.createdAt,
        clicks: sql<number>`COUNT(DISTINCT ${affiliateClick.id})`.mapWith(
          Number,
        ),
        // sales = distinct subscriptions + distinct one-time invoices (subscription_id IS NULL)
        sales: sql<number>`
          (
            COUNT(DISTINCT ${affiliateInvoice.subscriptionId})
            +
            COUNT(DISTINCT CASE WHEN ${affiliateInvoice.subscriptionId} IS NULL THEN ${affiliateInvoice.id} END)
          )
        `.mapWith(Number),
        conversionRate: sql<number>`
          CASE
            WHEN COUNT(DISTINCT ${affiliateClick.id}) > 0 THEN
              (
                (
                  COUNT(DISTINCT ${affiliateInvoice.subscriptionId})
                  +
                  COUNT(DISTINCT CASE WHEN ${affiliateInvoice.subscriptionId} IS NULL THEN ${affiliateInvoice.id} END)
                )::decimal
                /
                COUNT(DISTINCT ${affiliateClick.id})::decimal
              )
            ELSE 0
          END
        `.mapWith(Number),
      })
      .from(affiliateLink)
      .leftJoin(
        affiliateClick,
        eq(affiliateClick.affiliateLinkId, affiliateLink.id),
      )
      .leftJoin(
        affiliateInvoice,
        eq(affiliateInvoice.affiliateLinkId, affiliateLink.id),
      )
      .where(
        and(
          eq(affiliateLink.affiliateId, decoded.id),
          eq(affiliateLink.organizationId, decoded.organizationId),
        ),
      )
      .groupBy(affiliateLink.id, affiliateLink.createdAt)
      .orderBy(
        sql`
        CASE
          WHEN COUNT(DISTINCT ${affiliateClick.id}) > 0 THEN
            (
              (
                COUNT(DISTINCT ${affiliateInvoice.subscriptionId})
                +
                COUNT(DISTINCT CASE WHEN ${affiliateInvoice.subscriptionId} IS NULL THEN ${affiliateInvoice.id} END)
              )::decimal
              /
              COUNT(DISTINCT ${affiliateClick.id})::decimal
            )
          ELSE 0
        END DESC
      `,
      )
      .limit(10);

    const data: AffiliateLinkWithStats[] = rows.map((r) => ({
      id: r.id,
      fullUrl: `https://${baseDomain}/?${param}=${r.id}`,
      clicks: r.clicks,
      sales: r.sales,
      conversionRate: r.conversionRate, // already a Number (0..1). multiply by 100 in UI if you show %
      createdAt: r.createdAt,
    }));

    return { ok: true, data };
  } catch (err) {
    console.error("getTopPerformingAffiliateLinks error:", err);
    return returnError(err) as ResponseData<AffiliateLinkWithStats[]>;
  }
};
