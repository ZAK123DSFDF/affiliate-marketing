"use server"

import { getAffiliatesWithStatsAction } from "@/lib/server/getAffiliatesWithStats"

export async function getTopAffiliatesByConversionRate(
  orgId: string,
  year?: number,
  month?: number
) {
  return await getAffiliatesWithStatsAction(orgId, year, month, undefined, {
    exclude: ["paypalEmail"],
    orderBy: "conversionRate",
    orderDir: "desc",
    limit: 10,
  })
}
