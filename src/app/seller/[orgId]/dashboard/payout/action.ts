// app/seller/[orgId]/dashboard/payouts/action.ts
"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { db } from "@/db/drizzle";
import {
  affiliate,
  affiliateLink,
  affiliateClick,
  affiliateInvoice,
  organization,
} from "@/db/schema";
import { and, between, eq, inArray, or, sql } from "drizzle-orm";
import { returnError } from "@/lib/errorHandler";
import { ResponseData } from "@/lib/types/response";
import { AffiliatePayout } from "@/lib/types/affiliatePayout";
import { UnpaidMonth } from "@/lib/types/unpaidMonth";

/* ------------------------------------------------------------------ */
/* 🚀 main                                                            */
/* ------------------------------------------------------------------ */
export async function getAffiliatePayouts(
  orgId: string,
  month?: number,
  year?: number,
): Promise<ResponseData<AffiliatePayout[]>> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) throw { status: 401, toast: "Unauthorized" };

    const { id: userId } = jwt.decode(token) as { id: string };
    const isMember = await db.query.userToOrganization.findFirst({
      where: (t, { and, eq }) =>
        and(eq(t.userId, userId), eq(t.organizationId, orgId)),
    });
    if (!isMember) throw { status: 403, toast: "Forbidden" };
    const org = await db
      .select({
        domain: organization.domainName,
        param: organization.referralParam,
      })
      .from(organization)
      .where(eq(organization.id, orgId))
      .then((r) => r[0]);
    if (!org) throw { status: 404, toast: "Org not found" };
    const affRows = await db
      .select({ id: affiliate.id, email: affiliate.email })
      .from(affiliate)
      .where(eq(affiliate.organizationId, orgId));
    if (!affRows.length) return { ok: true, data: [] };
    const affIds = affRows.map((a) => a.id);
    const allLinks = await db
      .select({ id: affiliateLink.id, affId: affiliateLink.affiliateId })
      .from(affiliateLink)
      .where(
        and(
          eq(affiliateLink.organizationId, orgId),
          inArray(affiliateLink.affiliateId, affIds),
        ),
      );
    const linksByAffiliate: Record<string, string[]> = {};
    const linkIds: string[] = [];
    allLinks.forEach((l) => {
      const url = `https://${org.domain}/?${org.param}=${l.id}`;
      (linksByAffiliate[l.affId] ||= []).push(url);
      linkIds.push(l.id);
    });
    let clickCond, invoiceCond;
    if (month && year) {
      const from = new Date(Date.UTC(year, month - 1, 1));
      const to = new Date(Date.UTC(year, month, 0, 23, 59, 59));
      clickCond = between(affiliateClick.createdAt, from, to);
      invoiceCond = between(affiliateInvoice.createdAt, from, to);
    } else if (year) {
      const from = new Date(Date.UTC(year, 0, 1));
      const to = new Date(Date.UTC(year, 11, 31, 23, 59, 59));
      clickCond = between(affiliateClick.createdAt, from, to);
      invoiceCond = between(affiliateInvoice.createdAt, from, to);
    }
    const [clickAgg, invoiceAgg] = await Promise.all([
      db
        .select({
          linkId: affiliateClick.affiliateLinkId,
          visits: sql<number>`count(*)`.mapWith(Number),
        })
        .from(affiliateClick)
        .where(
          clickCond
            ? and(inArray(affiliateClick.affiliateLinkId, linkIds), clickCond)
            : inArray(affiliateClick.affiliateLinkId, linkIds),
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
          invoiceCond
            ? and(
                inArray(affiliateInvoice.affiliateLinkId, linkIds),
                invoiceCond,
              )
            : inArray(affiliateInvoice.affiliateLinkId, linkIds),
        )
        .groupBy(affiliateInvoice.affiliateLinkId),
    ]);

    const clicksMap = new Map(clickAgg.map((r) => [r.linkId, r.visits]));
    const invoiceMap = new Map(
      invoiceAgg.map((r) => [
        r.linkId,
        {
          sales: r.subs + r.singles,
          commission: r.commission,
          paid: r.paid,
          unpaid: r.unpaid,
        },
      ]),
    );

    const rows: AffiliatePayout[] = affRows.map((aff) => {
      const urls = linksByAffiliate[aff.id] ?? [];

      let visitors = 0;
      let sales = 0;
      let commission = 0;
      let paid = 0;
      let unpaid = 0;

      for (const url of urls) {
        const linkId = url.split("=").pop()!;

        visitors += clicksMap.get(linkId) ?? 0;

        const inv = invoiceMap.get(linkId);
        if (inv) {
          sales += inv.sales;
          commission += inv.commission;
          paid += inv.paid;
          unpaid += inv.unpaid;
        }
      }

      return {
        id: aff.id,
        email: aff.email,
        visitors,
        sales,
        commission,
        paid,
        unpaid,
        links: urls,
      };
    });

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
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) throw { status: 401, toast: "Unauthorized" };

    const { id: userId } = jwt.decode(token) as { id: string };
    const isMember = await db.query.userToOrganization.findFirst({
      where: (t, { and, eq }) =>
        and(eq(t.userId, userId), eq(t.organizationId, orgId)),
    });
    if (!isMember) throw { status: 403, toast: "Forbidden" };

    const org = await db
      .select({
        domain: organization.domainName,
        param: organization.referralParam,
      })
      .from(organization)
      .where(eq(organization.id, orgId))
      .then((r) => r[0]);

    if (!org) throw { status: 404, toast: "Org not found" };

    const affRows = await db
      .select({ id: affiliate.id, email: affiliate.email })
      .from(affiliate)
      .where(eq(affiliate.organizationId, orgId));

    if (!affRows.length) return { ok: true, data: [] };

    const affIds = affRows.map((a) => a.id);

    const allLinks = await db
      .select({ id: affiliateLink.id, affId: affiliateLink.affiliateId })
      .from(affiliateLink)
      .where(
        and(
          eq(affiliateLink.organizationId, orgId),
          inArray(affiliateLink.affiliateId, affIds),
        ),
      );

    const linksByAffiliate: Record<string, string[]> = {};
    const linkIds: string[] = [];

    allLinks.forEach((l) => {
      const url = `https://${org.domain}/?${org.param}=${l.id}`;
      (linksByAffiliate[l.affId] ||= []).push(url);
      linkIds.push(l.id);
    });

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

    const clicksMap = new Map(clickAgg.map((r) => [r.linkId, r.visits]));
    const invoiceMap = new Map(
      invoiceAgg.map((r) => [
        r.linkId,
        {
          sales: r.subs + r.singles,
          commission: r.commission,
          paid: r.paid,
          unpaid: r.unpaid,
        },
      ]),
    );

    const rows: AffiliatePayout[] = affRows.map((aff) => {
      const urls = linksByAffiliate[aff.id] ?? [];

      let visitors = 0;
      let sales = 0;
      let commission = 0;
      let paid = 0;
      let unpaid = 0;

      for (const url of urls) {
        const linkId = url.split("=").pop()!;

        visitors += clicksMap.get(linkId) ?? 0;

        const inv = invoiceMap.get(linkId);
        if (inv) {
          sales += inv.sales;
          commission += inv.commission;
          paid += inv.paid;
          unpaid += inv.unpaid;
        }
      }

      return {
        id: aff.id,
        email: aff.email,
        visitors,
        sales,
        commission,
        paid,
        unpaid,
        links: urls,
      };
    });
    console.log("Affiliate payouts bulk data:", rows);
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
