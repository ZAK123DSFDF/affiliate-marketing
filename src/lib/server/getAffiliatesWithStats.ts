"use server";

import { getAffiliatePayoutAction } from "@/lib/server/getAffiliatePayout";
export async function getAffiliatesWithStatsAction(
  orgId: string,
  year?: number,
  month?: number,
) {
  return getAffiliatePayoutAction(orgId, year, month);
}
