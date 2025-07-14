// app/seller/[orgId]/dashboard/payouts/action.ts
"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { db } from "@/db/drizzle";
import {
  affiliate,
  affiliateClick,
  affiliateLink,
  affiliatePayment,
  organization,
  userToOrganization,
} from "@/db/schema";
import { and, between, eq, inArray, sql, type InferModel } from "drizzle-orm";
import { returnError } from "@/lib/errorHandler";

/* -------------------------------------------------------------------------- */
/*                                🔑 TYPES                                    */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*                           🚀 ACTION FUNCTION                               */
/* -------------------------------------------------------------------------- */

export async function getAffiliatePayouts(
  orgId: string,
  month?: number,
  year?: number,
): Promise<AffiliatePayoutsResponse> {
  try {
    /* ------------------------------ Auth check ----------------------------- */
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

    /* --------- Org basics (needed to build full tracking URLs later) ------- */
    const org = await db
      .select({
        domain: organization.domainName,
        param: organization.referralParam,
      })
      .from(organization)
      .where(eq(organization.id, orgId))
      .then((r) => r[0]);

    if (!org) throw { status: 404, toast: "Organization not found" };

    /* ------------------------- Fetch all affiliates ------------------------ */
    const aff = await db
      .select({ id: affiliate.id, email: affiliate.email })
      .from(affiliate)
      .where(eq(affiliate.organizationId, orgId));

    if (!aff.length) return { ok: true, data: [] };

    const affiliateIds = aff.map((a) => a.id);

    /* ---------------------- Their links (ids + URLs) ----------------------- */
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

    /* ---------------------- Optional month‑year filter --------------------- */
    let dateCondClicks: ReturnType<typeof between> | undefined = undefined;
    let dateCondPay: ReturnType<typeof between> | undefined = undefined;
    if (month && year) {
      const from = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
      const to = new Date(Date.UTC(year, month, 0, 23, 59, 59));
      // NOTE: applies to both clicks and payments
      dateCondClicks = between(affiliateClick.createdAt, from, to);
      dateCondPay = between(affiliatePayment.createdAt, from, to);
    }

    /* -------------------- Visitors (clicks) aggregated -------------------- */
    const clickRows = await db
      .select({
        linkId: affiliateClick.affiliateLinkId,
        visits: sql<number>`count(*)`.mapWith(Number),
      })
      .from(affiliateClick)
      .where(
        dateCondClicks
          ? and(
              inArray(affiliateClick.affiliateLinkId, linkIds),
              dateCondClicks,
            )
          : inArray(affiliateClick.affiliateLinkId, linkIds),
      )
      .groupBy(affiliateClick.affiliateLinkId);

    const visitsByLink: Record<string, number> = {};
    clickRows.forEach((c) => (visitsByLink[c.linkId] = c.visits));

    /* ----------------- Sales & commissions aggregated --------------------- */
    const paymentRows = await db
      .select({
        linkId: affiliatePayment.affiliateLinkId,
        sales: sql<number>`count(*)`.mapWith(Number),
        commission: sql<string>`coalesce(sum(${affiliatePayment.commission}),0)`,
      })
      .from(affiliatePayment)
      .where(
        dateCondPay
          ? and(inArray(affiliatePayment.affiliateLinkId, linkIds), dateCondPay)
          : inArray(affiliatePayment.affiliateLinkId, linkIds),
      )
      .groupBy(affiliatePayment.affiliateLinkId);

    const salesByLink: Record<string, { sales: number; commission: number }> =
      {};
    paymentRows.forEach((p) => {
      salesByLink[p.linkId] = {
        sales: p.sales,
        commission: parseFloat(p.commission) || 0,
      };
    });

    /* --------------- (Optional) already‑paid amounts here ------------------ */
    const paidByLink: Record<string, number> = {};
    // TODO: join your payouts table and fill paidByLink if you have it.

    /* ------------------- Assemble final affiliate rows -------------------- */
    const rows: AffiliatePayout[] = aff.map((a) => {
      const linkList = linksByAff[a.id] ?? [];

      return linkList.reduce<AffiliatePayout>(
        (tot, url, i) => {
          const idPart = url.split("=").pop() as string;
          const visit = visitsByLink[idPart] ?? 0;
          const sale = salesByLink[idPart]?.sales ?? 0;
          const comm = salesByLink[idPart]?.commission ?? 0;
          const paid = paidByLink[idPart] ?? 0;

          tot.visitors += visit;
          tot.sales += sale;
          tot.commission += comm;
          tot.paid += paid;
          // only push links once
          tot.links.push(url);
          return tot;
        },
        {
          id: a.id,
          email: a.email,
          visitors: 0,
          sales: 0,
          commission: 0,
          paid: 0,
          unpaid: 0,
          links: [],
        },
      );
    });

    // compute unpaid
    rows.forEach((r) => (r.unpaid = r.commission - r.paid));

    return { ok: true, data: rows };
  } catch (err) {
    console.error("getAffiliatePayouts error:", err);
    return returnError(err) as AffiliatePayoutsResponse;
  }
}
// export type UnpaidMonth = { month: number; year: number };
// export async function getUnpaidMonths(
//   orgId: string,
// ): Promise<
//   | { ok: true; data: UnpaidMonth[] }
//   | { ok: false; status: number; error: string; toast?: string }
// > {
//   try {
//     const rows = await db
//       .select({
//         month:
//           sql<number>`extract(month from ${affiliatePayment.createdAt})`.mapWith(
//             Number,
//           ),
//         year: sql<number>`extract(year  from ${affiliatePayment.createdAt})`.mapWith(
//           Number,
//         ),
//       })
//       .from(affiliatePayment)
//       .where(
//         and(
//           eq(affiliatePayment.organizationId, orgId),
//           sql`paid_amount IS NULL OR paid_amount < commission`, // adapt to your schema
//         ),
//       )
//       .groupBy(sql.raw("year, month"));
//
//     return { ok: true, data: rows };
//   } catch (e) {
//     return returnError(e);
//   }
// }
