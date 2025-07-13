"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { db } from "@/db/drizzle";
import {
  affiliate,
  affiliateLink,
  affiliatePayment,
  userToOrganization,
  organization,
} from "@/db/schema";
import { and, eq, inArray, sql, between } from "drizzle-orm";
import { returnError } from "@/lib/errorHandler";

export type AffiliatePayout = {
  id: string;
  email: string;
  visitors: number;
  sales: number;
  commission: number;
  paid: number;
  unpaid: number;
  links: string[];
};

export type AffiliatePayoutsResponse =
  | { ok: true; data: AffiliatePayout[] }
  | { ok: false; status: number; error: string; toast?: string };
export async function getAffiliatePayouts(
  orgId: string,
  month?: number,
  year?: number,
): Promise<AffiliatePayoutsResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) throw { status: 401, toast: "Unauthorized" };
    const { id: userId } = jwt.decode(token) as { id: string };
    if (!userId) throw { status: 400, toast: "Invalid session" };
    const membership = await db.query.userToOrganization.findFirst({
      where: (u, { and, eq }) =>
        and(eq(u.userId, userId), eq(u.organizationId, orgId)),
    });
    if (!membership) throw { status: 403, toast: "Forbidden" };
    const org = await db
      .select({
        domain: organization.domainName,
        param: organization.referralParam,
      })
      .from(organization)
      .where(eq(organization.id, orgId))
      .then((r) => r[0]);
    if (!org) throw { status: 404, toast: "Org not found" };
    const aff = await db
      .select({ id: affiliate.id, email: affiliate.email })
      .from(affiliate)
      .where(eq(affiliate.organizationId, orgId));

    if (!aff.length) return { ok: true, data: [] };

    const affiliateIds = aff.map((a) => a.id);
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

    const linksByAff: Record<string, string[]> = {};
    links.forEach((l) => {
      linksByAff[l.affiliateId] ||= [];
      linksByAff[l.affiliateId].push(
        `https://${org.domain}/?${org.param}=${l.id}`,
      );
    });
    const linkIds = links.map((l) => l.id);
    let dateCondition = undefined;
    if (month && year) {
      const from = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
      const to = new Date(Date.UTC(year, month, 0, 23, 59, 59));
      dateCondition = between(affiliatePayment.createdAt, from, to);
    }
    const paymentRows = await db
      .select({
        linkId: affiliatePayment.affiliateLinkId,
        sales: sql<number>`count(*)`.mapWith(Number),
        commission: sql<string>`sum(${affiliatePayment.commission})`,
      })
      .from(affiliatePayment)
      .where(
        dateCondition
          ? and(
              inArray(affiliatePayment.affiliateLinkId, linkIds),
              dateCondition,
            )
          : inArray(affiliatePayment.affiliateLinkId, linkIds),
      )
      .groupBy(affiliatePayment.affiliateLinkId);

    const salesByLink: Record<string, { sales: number; commission: number }> =
      {};
    paymentRows.forEach((p) => {
      salesByLink[p.linkId] = {
        sales: p.sales,
        commission: parseFloat(p.commission),
      };
    });

    const paidByLink: Record<string, number> = {};
    const rows: AffiliatePayout[] = aff.map((a) => {
      const rowLinks = linksByAff[a.id] ?? [];
      let sales = 0,
        commission = 0,
        paid = 0;
      rowLinks.forEach((url) => {
        const linkId = url.split("=").pop()!;
        sales += salesByLink[linkId]?.sales ?? 0;
        commission += salesByLink[linkId]?.commission ?? 0;
        paid += paidByLink[linkId] ?? 0;
      });

      return {
        id: a.id,
        email: a.email,
        visitors: 0,
        sales,
        commission,
        paid,
        unpaid: commission - paid,
        links: rowLinks,
      };
    });

    return { ok: true, data: rows };
  } catch (err) {
    console.error("getAffiliatePayouts error:", err);
    return returnError(err) as AffiliatePayoutsResponse;
  }
}
