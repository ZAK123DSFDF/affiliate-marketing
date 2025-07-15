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
  userToOrganization,
} from "@/db/schema";
import { and, between, eq, inArray, sql } from "drizzle-orm";
import { returnError } from "@/lib/errorHandler";
import { ResponseData } from "@/lib/types/response";
import { AffiliatePayout } from "@/lib/types/affiliatePayout";

/* ------------------------------------------------------------------ */
/* 🚀 main                                                            */
/* ------------------------------------------------------------------ */
export async function getAffiliatePayouts(
  orgId: string,
  month?: number,
  year?: number,
): Promise<ResponseData<AffiliatePayout[]>> {
  try {
    /* 1 — security -------------------------------------------------------- */
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) throw { status: 401, toast: "Unauthorized" };

    const { id: userId } = jwt.decode(token) as { id: string };
    const isMember = await db.query.userToOrganization.findFirst({
      where: (t, { and, eq }) =>
        and(eq(t.userId, userId), eq(t.organizationId, orgId)),
    });
    if (!isMember) throw { status: 403, toast: "Forbidden" };

    /* 2 — org basics (domain/param) -------------------------------------- */
    const org = await db
      .select({
        domain: organization.domainName,
        param: organization.referralParam,
      })
      .from(organization)
      .where(eq(organization.id, orgId))
      .then((r) => r[0]);
    if (!org) throw { status: 404, toast: "Org not found" };

    /* 3 — affiliates ------------------------------------------------------ */
    const affRows = await db
      .select({ id: affiliate.id, email: affiliate.email })
      .from(affiliate)
      .where(eq(affiliate.organizationId, orgId));
    if (!affRows.length) return { ok: true, data: [] };

    const affIds = affRows.map((a) => a.id);

    /* 4 — their links (needed for URLs & join key) ------------------------ */
    const allLinks = await db
      .select({ id: affiliateLink.id, affId: affiliateLink.affiliateId })
      .from(affiliateLink)
      .where(
        and(
          eq(affiliateLink.organizationId, orgId),
          inArray(affiliateLink.affiliateId, affIds),
        ),
      );

    /* helper: links per affiliate + flat list of link‑ids */
    const linksByAffiliate: Record<string, string[]> = {};
    const linkIds: string[] = [];
    allLinks.forEach((l) => {
      const url = `https://${org.domain}/?${org.param}=${l.id}`;
      (linksByAffiliate[l.affId] ||= []).push(url);
      linkIds.push(l.id);
    });

    /* 5 — optional month filter ----------------------------------------- */
    let clickCond, invoiceCond;
    if (month && year) {
      const from = new Date(Date.UTC(year, month - 1, 1));
      const to = new Date(Date.UTC(year, month, 0, 23, 59, 59));
      clickCond = between(affiliateClick.createdAt, from, to);
      invoiceCond = between(affiliateInvoice.createdAt, from, to);
    }

    /* 6 — aggregate clicks per link -------------------------------------- */
    const clk = await db
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
      .groupBy(affiliateClick.affiliateLinkId)
      .as("clk");

    /* 7 — aggregate invoices per link (negatives included) --------------- */
    const inv = await db
      .select({
        linkId: affiliateInvoice.affiliateLinkId,
        // only “positive” rows count as a sale
        sales: sql<number>`
          sum(case when ${affiliateInvoice.amount} > 0 then 1 else 0 end)
        `.mapWith(Number),
        commission: sql<string>`coalesce(sum(${affiliateInvoice.commission}),0)`,
        paid: sql<string>`coalesce(sum(${affiliateInvoice.paidAmount}),0)`,
        unpaid: sql<string>`coalesce(sum(${affiliateInvoice.unpaidAmount}),0)`,
      })
      .from(affiliateInvoice)
      .where(
        invoiceCond
          ? and(inArray(affiliateInvoice.affiliateLinkId, linkIds), invoiceCond)
          : inArray(affiliateInvoice.affiliateLinkId, linkIds),
      )
      .groupBy(affiliateInvoice.affiliateLinkId)
      .as("inv");

    /* 8 — join links ↔ clicks/invoices and group by affiliate ------------ */
    const agg = await db
      .select({
        affiliateId: affiliateLink.affiliateId,

        visitors: sql<number>`coalesce(sum(${clk}.visits),0)`.mapWith(Number),

        sales: sql<number>`coalesce(sum(${inv}.sales),0)`.mapWith(Number),

        commission: sql<number>`
          coalesce(sum(${inv}.commission),0)
        `.mapWith(Number),

        paid: sql<number>`coalesce(sum(${inv}.paid),0)`.mapWith(Number),

        unpaid: sql<number>`coalesce(sum(${inv}.unpaid),0)`.mapWith(Number),
      })
      .from(affiliateLink)
      .leftJoin(clk, eq(clk.linkId, affiliateLink.id))
      .leftJoin(inv, eq(inv.linkId, affiliateLink.id))
      .where(eq(affiliateLink.organizationId, orgId))
      .groupBy(affiliateLink.affiliateId);

    /* 9 — stitch everything together ------------------------------------- */
    const rows: AffiliatePayout[] = agg.map((r) => ({
      id: r.affiliateId,
      email: affRows.find((a) => a.id === r.affiliateId)!.email,
      visitors: r.visitors,
      sales: r.sales,
      commission: r.commission,
      paid: r.paid,
      unpaid: r.unpaid,
      links: linksByAffiliate[r.affiliateId] ?? [],
    }));

    return { ok: true, data: rows };
  } catch (err) {
    console.error("getAffiliatePayouts error:", err);
    return returnError(err) as ResponseData<AffiliatePayout[]>;
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
