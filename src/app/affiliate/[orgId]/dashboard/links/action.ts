"use server";

import { db } from "@/db/drizzle";
import { affiliateClick, affiliateInvoice, affiliateLink } from "@/db/schema";
import { generateAffiliateCode } from "@/util/idGenerators";
import { getOrganization } from "@/util/GetOrganization";
import { revalidatePath } from "next/cache";
import { inArray, sql } from "drizzle-orm";
import { returnError } from "@/lib/errorHandler";
import { ResponseData } from "@/lib/types/response";
export type AffiliateLinkWithStats = {
  id: string;
  fullUrl: string;
  clicks: number;
  sales: number;
  createdAt: Date;
};

export const createAffiliateLink = async () => {
  const { org, decoded } = await getOrganization();

  const code = generateAffiliateCode(); // e.g., "7hjKpQ"
  const param = org.referralParam;
  const domain = org.domainName.replace(/^https?:\/\//, "");

  const fullUrl = `https://${domain}/?${param}=${code}`;

  await db.insert(affiliateLink).values({
    id: code,
    affiliateId: decoded.id,
    organizationId: decoded.organizationId,
  });
  revalidatePath(`/affiliate/${org.id}/dashboard/links`);
  return fullUrl;
};

export const getAffiliateLinksWithStats = async (): Promise<
  ResponseData<AffiliateLinkWithStats[]>
> => {
  try {
    const { org, decoded } = await getOrganization();

    const baseDomain = org.domainName.replace(/^https?:\/\//, "");
    const param = org.referralParam;

    // Step 1: Fetch all links for this affiliate in the current org
    const links = await db.query.affiliateLink.findMany({
      where: (l, { and, eq }) =>
        and(
          eq(l.affiliateId, decoded.id),
          eq(l.organizationId, decoded.organizationId),
        ),
    });

    if (!links.length) return { ok: true, data: [] };

    const linkIds = links.map((l) => l.id);

    // Step 2: Aggregate clicks & sales using GROUP BY
    const [clickAgg, salesAgg] = await Promise.all([
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
          count: sql<number>`count(*)`.mapWith(Number),
        })
        .from(affiliateInvoice)
        .where(inArray(affiliateInvoice.affiliateLinkId, linkIds))
        .groupBy(affiliateInvoice.affiliateLinkId),
    ]);

    // Step 3: Store counts in a map for fast lookup
    const clicksMap = new Map(clickAgg.map((c) => [c.id, c.count]));
    const salesMap = new Map(salesAgg.map((s) => [s.id, s.count]));

    // Step 4: Combine into final list
    const rows: AffiliateLinkWithStats[] = links.map((link) => ({
      id: link.id,
      fullUrl: `https://${baseDomain}/?${param}=${link.id}`,
      clicks: clicksMap.get(link.id) ?? 0,
      sales: salesMap.get(link.id) ?? 0,
      createdAt: link.createdAt,
    }));

    return { ok: true, data: rows };
  } catch (err) {
    console.error("getAffiliateLinksWithStats error:", err);
    return returnError(err) as ResponseData<AffiliateLinkWithStats[]>;
  }
};
