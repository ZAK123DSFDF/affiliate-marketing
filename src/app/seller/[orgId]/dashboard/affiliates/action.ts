"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { db } from "@/db/drizzle";
import {
  affiliate,
  affiliateLink,
  affiliateClick,
  organization,
  affiliateInvoice,
} from "@/db/schema";
import { and, eq, inArray, sql } from "drizzle-orm";
import { returnError } from "@/lib/errorHandler";
import { ResponseData } from "@/lib/types/response";
import { AffiliateStats } from "@/lib/types/affiliateStats";

export async function getAffiliatesWithStats(
  orgId: string,
): Promise<ResponseData<AffiliateStats[]>> {
  try {
    /* ------------------------------------------------------------------ */
    /*  OPTIONAL: Make sure the caller really belongs to this org          */
    /* ------------------------------------------------------------------ */
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) throw { status: 401, toast: "Unauthorized" };

    const { id: userId } = jwt.decode(token) as { id: string };
    if (!userId) throw { status: 400, toast: "Invalid session" };

    const rel = await db.query.userToOrganization.findFirst({
      where: (uto, { and, eq }) =>
        and(eq(uto.userId, userId), eq(uto.organizationId, orgId)),
    });
    if (!rel) throw { status: 403, toast: "Forbidden" };

    /* ------------------------------------------------------------------ */
    /* 1. basic org data (domain & param)                                  */
    /* ------------------------------------------------------------------ */
    const org = await db
      .select({
        domain: organization.domainName,
        param: organization.referralParam,
      })
      .from(organization)
      .where(eq(organization.id, orgId))
      .then((r) => r[0]);

    if (!org)
      throw {
        status: 404,
        toast: "Organization not found",
        error: "Not found",
      };

    /* ------------------------------------------------------------------ */
    /* 2. affiliates in this org                                           */
    /* ------------------------------------------------------------------ */
    const affiliates = await db
      .select({ id: affiliate.id, email: affiliate.email })
      .from(affiliate)
      .where(eq(affiliate.organizationId, orgId));

    if (!affiliates.length) return { ok: true, data: [] };

    const affiliateIds = affiliates.map((a) => a.id);

    /* ------------------------------------------------------------------ */
    /* 3. their links                                                      */
    /* ------------------------------------------------------------------ */
    const links = await db
      .select({
        id: affiliateLink.id,
        affiliateId: affiliateLink.affiliateId,
      })
      .from(affiliateLink)
      .where(
        and(
          eq(affiliateLink.organizationId, orgId),
          inArray(affiliateLink.affiliateId, affiliateIds),
        ),
      );

    const linksByAffiliate: Record<string, string[]> = {};
    links.forEach((l) => {
      const url = `https://${org.domain}/?${org.param}=${l.id}`;
      (linksByAffiliate[l.affiliateId] ||= []).push(url);
    });

    const linkIds = links.map((l) => l.id);

    /* ------------------------------------------------------------------ */
    /* 4. aggregate clicks                                                 */
    /* ------------------------------------------------------------------ */
    const [clickAgg, invoiceAgg] = await Promise.all([
      db
        .select({
          id: affiliateClick.affiliateLinkId,
          visits: sql<number>`count(*)`.mapWith(Number),
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
          singles: sql<number>`
        sum(case when ${affiliateInvoice.subscriptionId} is null then 1 else 0 end)
      `.mapWith(Number),
          commission: sql<string>`coalesce(sum(${affiliateInvoice.commission}), 0)`,
          paid: sql<string>`coalesce(sum(${affiliateInvoice.paidAmount}), 0)`,
          unpaid: sql<string>`coalesce(sum(${affiliateInvoice.unpaidAmount}), 0)`,
        })
        .from(affiliateInvoice)
        .where(inArray(affiliateInvoice.affiliateLinkId, linkIds))
        .groupBy(affiliateInvoice.affiliateLinkId),
    ]);

    const visitsByLink: Record<string, number> = {};
    clickAgg.forEach((c) => (visitsByLink[c.id] = c.visits));

    /* ------------------------------------------------------------------ */
    /* 5. aggregate payments                                               */
    /* ------------------------------------------------------------------ */

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

    /* ------------------------------------------------------------------ */
    /* 6. build rows                                                       */
    /* ------------------------------------------------------------------ */
    const rows: AffiliateStats[] = affiliates.map((a) => {
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

      return {
        id: a.id,
        email: a.email,
        visitors,
        sales,
        commission,
        paid,
        unpaid,
        links: linkList,
      };
    });

    return { ok: true, data: rows };
  } catch (err) {
    console.error("getAffiliatesWithStats error:", err);
    return returnError(err) as ResponseData<AffiliateStats[]>;
  }
}
