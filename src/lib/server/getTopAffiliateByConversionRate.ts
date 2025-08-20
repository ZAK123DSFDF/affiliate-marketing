"use server";

import { getAffiliatesWithStatsAction } from "@/lib/server/getAffiliatesWithStats";

export async function getTopAffiliatesByConversionRate(
  orgId: string,
  year?: number,
  month?: number,
) {
  return await getAffiliatesWithStatsAction(orgId, year, month, undefined, {
    orderBy: "conversionRate",
    orderDir: "desc",
    limit: 10,
  });
}
