"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { db } from "@/db/drizzle";
import {
  affiliate,
  affiliateLink,
  affiliateClick,
  affiliatePayment,
  organization,
  userToOrganization,
} from "@/db/schema";
import { and, eq, inArray, sql } from "drizzle-orm";
import { returnError } from "@/lib/errorHandler";

export type AffiliateStats = {
  id: string;
  email: string;
  visitors: number;
  sales: number;
  commission: number;
  links: string[];
};

export type AffiliatesResponse =
  | { ok: true; data: AffiliateStats[] }
  | { ok: false; error: string; status: number; toast?: string };

export async function getAffiliatesWithStats(
  orgId: string,
): Promise<AffiliatesResponse> {
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
    const clickAgg = await db
      .select({
        id: affiliateClick.affiliateLinkId,
        visits: sql<number>`count(*)`.mapWith(Number),
      })
      .from(affiliateClick)
      .where(inArray(affiliateClick.affiliateLinkId, linkIds))
      .groupBy(affiliateClick.affiliateLinkId);

    const visitsByLink: Record<string, number> = {};
    clickAgg.forEach((c) => (visitsByLink[c.id] = c.visits));

    /* ------------------------------------------------------------------ */
    /* 5. aggregate payments                                               */
    /* ------------------------------------------------------------------ */
    const payAgg = await db
      .select({
        id: affiliatePayment.affiliateLinkId,
        sales: sql<number>`count(*)`.mapWith(Number),
        commission: sql<string>`sum(${affiliatePayment.commission})`,
      })
      .from(affiliatePayment)
      .where(inArray(affiliatePayment.affiliateLinkId, linkIds))
      .groupBy(affiliatePayment.affiliateLinkId);

    const salesByLink: Record<string, { sales: number; commission: number }> =
      {};
    payAgg.forEach(
      (p) =>
        (salesByLink[p.id] = {
          sales: p.sales,
          commission: parseFloat(p.commission),
        }),
    );

    /* ------------------------------------------------------------------ */
    /* 6. build rows                                                       */
    /* ------------------------------------------------------------------ */
    const rows: AffiliateStats[] = affiliates.map((a) => {
      const linkList = linksByAffiliate[a.id] ?? [];
      const visitors = linkList.reduce(
        (sum, url) => sum + (visitsByLink[url.split("=").pop()!] ?? 0),
        0,
      );

      const { sales, commission } = linkList.reduce(
        (acc, url) => {
          const key = url.split("=").pop()!;
          acc.sales += salesByLink[key]?.sales ?? 0;
          acc.commission += salesByLink[key]?.commission ?? 0;
          return acc;
        },
        { sales: 0, commission: 0 },
      );

      return {
        id: a.id,
        email: a.email,
        visitors,
        sales,
        commission,
        links: linkList,
      };
    });

    return { ok: true, data: rows };
  } catch (err) {
    console.error("getAffiliatesWithStats error:", err);
    return returnError(err) as AffiliatesResponse;
  }
}
