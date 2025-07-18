// actions/getAffiliateCommissionByMonth.ts
"use server";
import { getOrganization } from "@/util/GetOrganization";
import { db } from "@/db/drizzle";
import { AffiliatePaymentRow } from "@/lib/types/affiliatePaymentRow";
import { ResponseData } from "@/lib/types/response";
import { and, inArray, sql } from "drizzle-orm";
import { affiliateInvoice } from "@/db/schema";
import { returnError } from "@/lib/errorHandler";

export const getAffiliateCommissionByMonth = async (
  year?: number,
): Promise<ResponseData<AffiliatePaymentRow[]>> => {
  try {
    const { org, decoded } = await getOrganization();

    const links = await db.query.affiliateLink.findMany({
      where: (l, { eq, and }) =>
        and(eq(l.organizationId, org.id), eq(l.affiliateId, decoded.id)),
    });

    if (!links.length) return { ok: true, data: [] };
    const linkIds = links.map((l) => l.id);

    // Default to current year if none provided
    const targetYear = year ?? new Date().getFullYear();

    const rows = await db
      .select({
        month: sql<string>`to_char(${affiliateInvoice.createdAt}, 'YYYY-MM')`,
        totalCommission:
          sql<number>`sum(${affiliateInvoice.commission})`.mapWith(Number),
        paidCommission:
          sql<number>`sum(${affiliateInvoice.paidAmount})`.mapWith(Number),
        unpaidCommission:
          sql<number>`sum(${affiliateInvoice.unpaidAmount})`.mapWith(Number),
      })
      .from(affiliateInvoice)
      .where(
        and(
          sql`extract(year from ${affiliateInvoice.createdAt}) = ${targetYear}`,
          inArray(affiliateInvoice.affiliateLinkId, linkIds),
        ),
      )
      .groupBy(sql`to_char(${affiliateInvoice.createdAt}, 'YYYY-MM')`);

    return { ok: true, data: rows };
  } catch (err) {
    console.error("getAffiliateCommissionByMonth error:", err);
    return returnError(err) as ResponseData<AffiliatePaymentRow[]>;
  }
};
