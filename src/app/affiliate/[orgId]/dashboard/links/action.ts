"use server";

import { db } from "@/db/drizzle";
import { affiliateClick, affiliateInvoice, affiliateLink } from "@/db/schema";
import { generateAffiliateCode } from "@/util/idGenerators";
import { getAffiliateOrganization } from "@/lib/server/GetAffiliateOrganization";
import { revalidatePath } from "next/cache";
import { inArray, sql } from "drizzle-orm";
import { returnError } from "@/lib/errorHandler";
import { ResponseData } from "@/lib/types/response";
import { AffiliateLinkWithStats } from "@/lib/types/affiliateLinkWithStats";
import { getAffiliateLinks } from "@/lib/server/getAffiliateLinks";
import { buildWhereWithDate } from "@/util/BuildWhereWithDate";

export const createAffiliateLink = async () => {
  const { org, decoded } = await getAffiliateOrganization();

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

export const getAffiliateLinksWithStats = async (
  year?: number,
  month?: number,
): Promise<ResponseData<AffiliateLinkWithStats[]>> => {
  try {
    const { org, decoded } = await getAffiliateOrganization();

    const baseDomain = org.domainName.replace(/^https?:\/\//, "");
    const param = org.referralParam;
    console.log("year and month", year, month);
    // Step 1: Fetch all links for this affiliate in the current org
    const { linkIds, links } = await getAffiliateLinks(decoded);
    if (!linkIds.length || !links) return { ok: true, data: [] };
    // Step 2: Aggregate clicks & sales using GROUP BY
    const [clickAgg, salesAgg] = await Promise.all([
      db
        .select({
          id: affiliateClick.affiliateLinkId,
          count: sql<number>`count(*)`.mapWith(Number),
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

    // Step 3: Store counts in a map for fast lookup
    const clicksMap = new Map(clickAgg.map((c) => [c.id, c.count]));
    const salesMap = new Map(
      salesAgg.map((r) => [r.id, (r.subs ?? 0) + (r.singles ?? 0)]),
    );

    // Step 4: Combine into final list
    const rows: AffiliateLinkWithStats[] = links.map((link) => {
      const clicks = clicksMap.get(link.id) ?? 0;
      const sales = salesMap.get(link.id) ?? 0;

      const conversionRate = clicks > 0 ? (sales / clicks) * 100 : 0;
      console.log("link created at", link.createdAt);
      return {
        id: link.id,
        fullUrl: `https://${baseDomain}/?${param}=${link.id}`,
        clicks,
        sales,
        conversionRate,
        createdAt: link.createdAt,
      };
    });

    return { ok: true, data: rows };
  } catch (err) {
    console.error("getAffiliateLinksWithStats error:", err);
    return returnError(err) as ResponseData<AffiliateLinkWithStats[]>;
  }
};
