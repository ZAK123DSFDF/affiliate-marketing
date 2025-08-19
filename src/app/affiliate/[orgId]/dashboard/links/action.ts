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
import { getAffiliatesWithStatsAction } from "@/lib/server/getAffiliatesWithStats";
import { getAffiliateLinksWithStatsAction } from "@/lib/server/getAffiliateLinksWithStats";

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
    const { decoded } = await getAffiliateOrganization();
    const rows = await getAffiliateLinksWithStatsAction(decoded, year, month);

    return { ok: true, data: rows };
  } catch (err) {
    console.error("getAffiliateLinksWithStats error:", err);
    return returnError(err) as ResponseData<AffiliateLinkWithStats[]>;
  }
};
