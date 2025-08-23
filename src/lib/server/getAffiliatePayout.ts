"use server"

import { getAffiliatesWithStatsAction } from "@/lib/server/getAffiliatesWithStats"

export async function getAffiliatePayoutAction(
  orgId: string,
  year?: number,
  month?: number,
  orderBy?:
    | "conversionRate"
    | "commission"
    | "sales"
    | "visits"
    | "email"
    | "commissionPaid"
    | "commissionUnpaid",
  orderDir?: "asc" | "desc",
  limit?: number,
  offset?: number,
  email?: string
) {
  return await getAffiliatesWithStatsAction(orgId, year, month, undefined, {
    exclude: ["conversionRate"],
    orderBy,
    orderDir,
    limit,
    offset,
    email,
  })
}
