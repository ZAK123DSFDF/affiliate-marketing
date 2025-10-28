"use server"

import { ResponseData } from "@/lib/types/response"
import { AffiliateBasePayout, AffiliateStats } from "@/lib/types/affiliateStats"
import { getAffiliatesWithStatsAction } from "@/lib/server/getAffiliatesWithStats"
import { OrderBy, OrderDir } from "@/lib/types/orderTypes"
import { convertedCurrency } from "@/util/ConvertedCurrency"
import { handleAction } from "@/lib/handleAction"
import { getTeamAuthAction } from "@/lib/server/getTeamAuthAction"

export async function getTeamAffiliatesWithStats(
  orgId: string,
  year?: number,
  month?: number,
  orderBy?: OrderBy,
  orderDir?: OrderDir,
  offset?: number,
  email?: string
): Promise<ResponseData<AffiliateStats[]>> {
  return handleAction("getAffiliatesWithStats", async () => {
    const ordered = orderBy === "none" ? undefined : orderBy
    const org = await getTeamAuthAction(orgId)
    const rows = (await getAffiliatesWithStatsAction(
      orgId,
      year,
      month,
      undefined,
      {
        exclude: ["paypalEmail"],
        orderBy: ordered,
        orderDir,
        limit: 10,
        offset,
        email,
      }
    )) as AffiliateBasePayout[]
    const converted = await convertedCurrency<AffiliateBasePayout>(
      org.currency,
      rows
    )
    return { ok: true, data: converted }
  })
}
