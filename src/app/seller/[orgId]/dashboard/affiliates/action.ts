"use server"

import { returnError } from "@/lib/errorHandler"
import { ResponseData } from "@/lib/types/response"
import { AffiliateStats } from "@/lib/types/affiliateStats"
import { getOrgAuth } from "@/lib/server/GetOrgAuth"
import { getAffiliatesWithStatsAction } from "@/lib/server/getAffiliatesWithStats"
import { OrderBy, OrderDir } from "@/lib/types/orderTypes"
import { ExchangeRate } from "@/util/ExchangeRate"
import { convertedCurrency } from "@/util/ConvertedCurrency"

export async function getAffiliatesWithStats(
  orgId: string,
  year?: number,
  month?: number,
  orderBy?: OrderBy,
  orderDir?: OrderDir,
  offset?: number,
  email?: string
): Promise<ResponseData<AffiliateStats[]>> {
  const ordered = orderBy === "none" ? undefined : orderBy
  try {
    const org = await getOrgAuth(orgId)
    const rows = (await getAffiliatesWithStatsAction(
      orgId,
      year,
      month,
      undefined,
      {
        orderBy: ordered,
        orderDir,
        limit: 10,
        offset,
        email,
      }
    )) as AffiliateStats[]
    const converted = await convertedCurrency<AffiliateStats>(
      org.currency,
      rows
    )
    return { ok: true, data: converted }
  } catch (err) {
    console.error("getAffiliatesWithStats error:", err)
    return returnError(err) as ResponseData<AffiliateStats[]>
  }
}
