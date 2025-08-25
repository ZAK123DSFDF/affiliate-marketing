"use server"
import { AffiliateKpiStats } from "@/lib/types/affiliateKpiStats"
import { getAffiliateOrganization } from "@/lib/server/GetAffiliateOrganization"
import { ResponseData } from "@/lib/types/response"
import { returnError } from "@/lib/errorHandler"
import { AffiliateReferrerStat } from "@/lib/types/affiliateReferrerStat"
import { AffiliateKpiTimeSeries } from "@/lib/types/affiliateChartStats"
import { getAffiliateLinks } from "@/lib/server/getAffiliateLinks"
import { getTimeSeriesData } from "@/lib/server/getTimeSeriesData"
import { getReferrerStats } from "@/lib/server/getReferrerStats"
import { getAffiliateKpiStatsAction } from "@/lib/server/getAffiliateKpiStats"

export async function getAffiliateKpiStats(
  year?: number,
  month?: number
): Promise<ResponseData<AffiliateKpiStats[]>> {
  try {
    const decoded = await getAffiliateOrganization()
    const [row] = await getAffiliateKpiStatsAction(
      decoded.organizationId,
      decoded.id,
      year,
      month
    )

    const affiliateKpiStats: AffiliateKpiStats = {
      totalLinks: row?.totalLinks ?? 0,
      totalVisitors: row?.totalVisitors ?? 0,
      totalSales: row?.sales ?? 0,
      totalCommission: row?.commission ?? 0,
      totalCommissionPaid: row?.paid ?? 0,
      totalCommissionUnpaid: row?.unpaid ?? 0,
    }

    return { ok: true, data: [affiliateKpiStats] }
  } catch (err) {
    console.error("getAffiliateLinksWithStats error:", err)
    return returnError(err) as ResponseData<AffiliateKpiStats[]>
  }
}
export async function getAffiliateKpiTimeSeries(
  year?: number,
  month?: number
): Promise<ResponseData<AffiliateKpiTimeSeries[]>> {
  try {
    const decoded = await getAffiliateOrganization()
    const { linkIds } = await getAffiliateLinks(decoded)
    if (!linkIds.length) return { ok: true, data: [] }

    const data = await getTimeSeriesData<AffiliateKpiTimeSeries>(
      linkIds,
      year,
      month
    )

    return { ok: true, data }
  } catch (err) {
    return returnError(err) as ResponseData<AffiliateKpiTimeSeries[]>
  }
}

export async function getAffiliateReferrers(
  year?: number,
  month?: number
): Promise<ResponseData<AffiliateReferrerStat[]>> {
  try {
    const decoded = await getAffiliateOrganization()

    const { linkIds } = await getAffiliateLinks(decoded)
    if (!linkIds.length) return { ok: true, data: [] }
    const referrerStats = await getReferrerStats(linkIds, year, month)

    return { ok: true, data: referrerStats }
  } catch (err) {
    console.error("getAffiliateReferrers error:", err)
    return returnError(err) as ResponseData<AffiliateReferrerStat[]>
  }
}
