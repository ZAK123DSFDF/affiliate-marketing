"use server";
import { getAffiliatesWithStatsAction } from "@/lib/server/getAffiliatesWithStats";

export async function getAffiliatePayoutBulkAction(
  orgId: string,
  months: { month: number; year: number }[],
  orderBy?:
    | "conversionRate"
    | "commission"
    | "sales"
    | "visits"
    | "email"
    | "commissionPaid"
    | "commissionUnpaid",
  orderDir?: "asc" | "desc",
) {
  return await getAffiliatesWithStatsAction(
    orgId,
    undefined,
    undefined,
    months,
    {
      exclude: ["conversionRate"],
      orderBy,
      orderDir,
    },
  );
}
