"use server";

import { getAffiliatesWithStatsAction } from "@/lib/server/getAffiliatesWithStats";

export async function getAffiliatePayoutAction(
  orgId: string,
  year?: number,
  month?: number,
) {
  return await getAffiliatesWithStatsAction(orgId, year, month, undefined, {
    exclude: ["conversionRate"],
  });
}
