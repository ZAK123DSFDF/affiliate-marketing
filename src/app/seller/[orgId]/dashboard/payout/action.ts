"use server";

import { db } from "@/db/drizzle";
import { affiliateLink, affiliateClick, affiliateInvoice } from "@/db/schema";
import { and, between, eq, inArray, or, sql } from "drizzle-orm";
import { returnError } from "@/lib/errorHandler";
import { ResponseData } from "@/lib/types/response";
import { UnpaidMonth } from "@/lib/types/unpaidMonth";
import { getOrgAuth } from "@/lib/server/GetOrgAuth";
import { getOrgAffiliateLinks } from "@/lib/server/GetOrgAffiliateLinks";
import { getOrgClicksAndInvoiceAggregate } from "@/lib/server/GetOrgClicksAndInvoiceAggregate";
import { AffiliatePayout } from "@/lib/types/affiliateStats";
import { buildWhereWithDate } from "@/util/BuildWhereWithDate";
export async function getAffiliatePayouts(
  orgId: string,
  year?: number,
  month?: number,
): Promise<ResponseData<AffiliatePayout[]>> {
  try {
    const org = await getOrgAuth(orgId);
    const { linkIds, affRows, linksByAffiliate } = await getOrgAffiliateLinks(
      org,
      orgId,
    );
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
            year,
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
          singles: sql<number>`
                      sum(case when ${affiliateInvoice.subscriptionId} is null then 1 else 0 end)
                    `.mapWith(Number),
          commission: sql<number>`
      coalesce(sum(${affiliateInvoice.commission}), 0)
    `.mapWith(Number),

          paid: sql<number>`
      coalesce(sum(${affiliateInvoice.paidAmount}), 0)
    `.mapWith(Number),

          unpaid: sql<number>`
      coalesce(sum(${affiliateInvoice.unpaidAmount}), 0)
    `.mapWith(Number),
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

    const rows = getOrgClicksAndInvoiceAggregate(
      clickAgg,
      invoiceAgg,
      affRows,
      linksByAffiliate,
    );

    return { ok: true, data: rows };
  } catch (err) {
    console.error("getAffiliatePayouts error:", err);
    return returnError(err) as ResponseData<AffiliatePayout[]>;
  }
}
export async function getAffiliatePayoutsBulk(
  orgId: string,
  months: { month: number; year: number }[],
): Promise<ResponseData<AffiliatePayout[]>> {
  try {
    const org = await getOrgAuth(orgId);
    const { linkIds, affRows, linksByAffiliate } = await getOrgAffiliateLinks(
      org,
      orgId,
    );

    const clickDateFilters = months.map(({ month, year }) => {
      const from = new Date(Date.UTC(year, month - 1, 1));
      const to = new Date(Date.UTC(year, month, 0, 23, 59, 59));
      return between(affiliateClick.createdAt, from, to);
    });

    const invoiceDateFilters = months.map(({ month, year }) => {
      const from = new Date(Date.UTC(year, month - 1, 1));
      const to = new Date(Date.UTC(year, month, 0, 23, 59, 59));
      return between(affiliateInvoice.createdAt, from, to);
    });

    const [clickAgg, invoiceAgg] = await Promise.all([
      db
        .select({
          linkId: affiliateClick.affiliateLinkId,
          visits: sql<number>`count(*)`.mapWith(Number),
        })
        .from(affiliateClick)
        .where(
          and(
            inArray(affiliateClick.affiliateLinkId, linkIds),
            or(...clickDateFilters),
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
        })
        .from(affiliateInvoice)
        .where(
          and(
            inArray(affiliateInvoice.affiliateLinkId, linkIds),
            or(...invoiceDateFilters),
          ),
        )
        .groupBy(affiliateInvoice.affiliateLinkId),
    ]);

    const rows = getOrgClicksAndInvoiceAggregate(
      clickAgg,
      invoiceAgg,
      affRows,
      linksByAffiliate,
    );
    return { ok: true, data: rows };
  } catch (err) {
    console.error("getAffiliatePayoutsBulk error:", err);
    return returnError(err) as ResponseData<AffiliatePayout[]>;
  }
}

export async function getUnpaidMonths(
  orgId: string,
): Promise<ResponseData<UnpaidMonth[]>> {
  try {
    const rows = await db
      .select({
        month:
          sql<number>`extract(month from ${affiliateInvoice.createdAt})`.mapWith(
            Number,
          ),
        year: sql<number>`extract(year from ${affiliateInvoice.createdAt})`.mapWith(
          Number,
        ),
        unpaid: sql<number>`sum(${affiliateInvoice.unpaidAmount})`.mapWith(
          Number,
        ),
      })
      .from(affiliateInvoice)
      .innerJoin(
        affiliateLink,
        eq(affiliateInvoice.affiliateLinkId, affiliateLink.id),
      )
      .where(
        and(
          eq(affiliateLink.organizationId, orgId),
          sql`${affiliateInvoice.unpaidAmount} > 0`,
        ),
      )
      .groupBy(
        sql`EXTRACT(YEAR FROM ${affiliateInvoice.createdAt})`,
        sql`EXTRACT(MONTH FROM ${affiliateInvoice.createdAt})`,
      );

    return {
      ok: true,
      data: rows.map((row) => ({
        month: row.month,
        year: row.year,
        unpaid: row.unpaid,
      })),
    };
  } catch (e) {
    return returnError(e) as ResponseData<UnpaidMonth[]>;
  }
}
