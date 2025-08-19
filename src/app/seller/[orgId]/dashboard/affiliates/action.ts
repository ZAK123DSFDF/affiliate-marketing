"use server";

import { db } from "@/db/drizzle";
import { affiliateClick, affiliateInvoice } from "@/db/schema";
import { inArray, sql } from "drizzle-orm";
import { returnError } from "@/lib/errorHandler";
import { ResponseData } from "@/lib/types/response";
import { AffiliateStats } from "@/lib/types/affiliateStats";
import { getOrgAuth } from "@/util/GetOrgAuth";
import { getOrgAffiliateLinks } from "@/util/GetOrgAffiliateLinks";
import { buildWhereWithDate } from "@/util/BuildWhereWithDate";

export async function getAffiliatesWithStats(
  orgId: string,
  year?: number,
  month?: number,
): Promise<ResponseData<AffiliateStats[]>> {
  try {
    const org = await getOrgAuth(orgId);
    const { linkIds, affRows, linksByAffiliate } = await getOrgAffiliateLinks(
      org,
      orgId,
    );

    const [clickAgg, invoiceAgg] = await Promise.all([
      db
        .select({
          id: affiliateClick.affiliateLinkId,
          visits: sql<number>`count(*)`.mapWith(Number),
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
          singles: sql<number>`
        sum(case when ${affiliateInvoice.subscriptionId} is null then 1 else 0 end)
      `.mapWith(Number),
          commission: sql<string>`coalesce(sum(${affiliateInvoice.commission}), 0)`,
          paid: sql<string>`coalesce(sum(${affiliateInvoice.paidAmount}), 0)`,
          unpaid: sql<string>`coalesce(sum(${affiliateInvoice.unpaidAmount}), 0)`,
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

    const visitsByLink: Record<string, number> = {};
    clickAgg.forEach((c) => (visitsByLink[c.id] = c.visits));
    const salesByLink: Record<
      string,
      { sales: number; commission: number; paid: number; unpaid: number }
    > = {};

    invoiceAgg.forEach((row) => {
      salesByLink[row.id] = {
        sales: row.subs + row.singles,
        commission: parseFloat(row.commission),
        paid: parseFloat(row.paid),
        unpaid: parseFloat(row.unpaid),
      };
    });
    const rows: AffiliateStats[] = affRows.map((a) => {
      const linkList = linksByAffiliate[a.id] ?? [];
      const visitors = linkList.reduce(
        (sum, url) => sum + (visitsByLink[url.split("=").pop()!] ?? 0),
        0,
      );

      let sales = 0;
      let commission = 0;
      let paid = 0;
      let unpaid = 0;

      for (const url of linkList) {
        const key = url.split("=").pop()!;
        const stats = salesByLink[key];

        if (stats) {
          sales += stats.sales;
          commission += stats.commission;
          paid += stats.paid;
          unpaid += stats.unpaid;
        }
      }
      const conversionRate = visitors > 0 ? (sales / visitors) * 100 : 0;
      return {
        id: a.id,
        email: a.email,
        visitors,
        sales,
        commission,
        paid,
        unpaid,
        links: linkList,
        conversionRate,
      };
    });

    return { ok: true, data: rows };
  } catch (err) {
    console.error("getAffiliatesWithStats error:", err);
    return returnError(err) as ResponseData<AffiliateStats[]>;
  }
}
