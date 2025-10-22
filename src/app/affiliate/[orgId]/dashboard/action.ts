"use server"
import { AffiliateKpiStats } from "@/lib/types/affiliateKpiStats"
import { getAffiliateOrganization } from "@/lib/server/GetAffiliateOrganization"
import { ResponseData } from "@/lib/types/response"
import { AffiliateReferrerStat } from "@/lib/types/affiliateReferrerStat"
import { AffiliateKpiTimeSeries } from "@/lib/types/affiliateChartStats"
import { getAffiliateLinks } from "@/lib/server/getAffiliateLinks"
import { getTimeSeriesData } from "@/lib/server/getTimeSeriesData"
import { getReferrerStats } from "@/lib/server/getReferrerStats"
import { getAffiliateKpiStatsAction } from "@/lib/server/getAffiliateKpiStats"
import { getOrganization } from "@/lib/server/getOrganization"
import { ExchangeRate } from "@/util/ExchangeRate"
import { handleAction } from "@/lib/handleAction"

export async function getAffiliateKpiStats(
  orgId: string,
  year?: number,
  month?: number
): Promise<ResponseData<AffiliateKpiStats[]>> {
  return handleAction("getAffiliateKpiStats", async () => {
    const decoded = await getAffiliateOrganization(orgId)
    const [row] = await getAffiliateKpiStatsAction(
      decoded.orgId,
      decoded.id,
      year,
      month
    )
    const org = await getOrganization(decoded.orgId)
    const rate = await ExchangeRate(org.currency)
    const affiliateKpiStats: AffiliateKpiStats = {
      totalLinks: row?.totalLinks ?? 0,
      totalVisitors: row?.totalVisitors ?? 0,
      totalSales: row?.sales ?? 0,
      totalCommission: (row?.commission ?? 0) * rate,
      totalCommissionPaid: (row?.paid ?? 0) * rate,
      totalCommissionUnpaid: (row?.unpaid ?? 0) * rate,
      currency: org.currency,
    }

    return { ok: true, data: [affiliateKpiStats] }
  })
}
export async function getAffiliateKpiTimeSeries(
  orgId: string,
  year?: number,
  month?: number
): Promise<ResponseData<AffiliateKpiTimeSeries[]>> {
  return handleAction("getAffiliateKpiTimeSeries", async () => {
    const decoded = await getAffiliateOrganization(orgId)
    const { linkIds } = await getAffiliateLinks(decoded)
    if (!linkIds.length) return { ok: true, data: [] }

    const data = await getTimeSeriesData<AffiliateKpiTimeSeries>(
      linkIds,
      year,
      month
    )

    return { ok: true, data }
  })
}

export async function getAffiliateReferrers(
  orgId: string,
  year?: number,
  month?: number
): Promise<ResponseData<AffiliateReferrerStat[]>> {
  return handleAction("getAffiliateReferrers", async () => {
    const decoded = await getAffiliateOrganization(orgId)

    const { linkIds } = await getAffiliateLinks(decoded)
    if (!linkIds.length) return { ok: true, data: [] }
    const referrerStats = await getReferrerStats(linkIds, year, month)

    return { ok: true, data: referrerStats }
  })
}
