"use server";
import { getAffiliatesWithStatsAction } from "@/lib/server/getAffiliatesWithStats";

export async function getAffiliatePayoutBulkAction(
  orgId: string,
  months: { month: number; year: number }[],
) {
  return await getAffiliatesWithStatsAction(
    orgId,
    undefined,
    undefined,
    months,
    {
      exclude: ["conversionRate"],
    },
  );
}
