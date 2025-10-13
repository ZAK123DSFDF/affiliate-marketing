"use server"
import { returnError } from "@/lib/errorHandler"
import { getOrgAuth } from "@/lib/server/GetOrgAuth"
import { getOrgAffiliateLinks } from "@/lib/server/GetOrgAffiliateLinks"
import { ResponseData } from "@/lib/types/response"
import { SellerKpiStats } from "@/lib/types/affiliateKpiStats"
import { SellerKpiTimeSeries } from "@/lib/types/affiliateChartStats"
import { getTimeSeriesData } from "@/lib/server/getTimeSeriesData"
import { SellerReferrerStat } from "@/lib/types/affiliateReferrerStat"
import { getReferrerStats } from "@/lib/server/getReferrerStats"
import { AffiliateStats } from "@/lib/types/affiliateStats"
import { getTopAffiliatesByConversionRate } from "@/lib/server/getTopAffiliateByConversionRate"
import { getSellerKpiStatsAction } from "@/lib/server/getOrganizationKpiStats"
import { ExchangeRate } from "@/util/ExchangeRate"
import { convertedCurrency } from "@/util/ConvertedCurrency"

export async function getSellerKpiStats(
  orgId: string,
  year?: number,
  month?: number
): Promise<ResponseData<SellerKpiStats[]>> {
  try {
    const org = await getOrgAuth(orgId)
    const [row] = await getSellerKpiStatsAction(orgId, year, month)
    const rate = await ExchangeRate(org.currency)
    const sellerKpiStats: SellerKpiStats = {
      totalAffiliates: row?.totalAffiliates ?? 0,
      totalLinks: row?.totalLinks ?? 0,
      totalVisitors: row?.totalVisitors ?? 0,
      totalSales: row.sales ?? 0,
      totalCommission: (row?.commission ?? 0) * rate,
      totalCommissionPaid: (row?.paid ?? 0) * rate,
      totalCommissionUnpaid: (row?.unpaid ?? 0) * rate,
      totalAmount: (row?.amount ?? 0) * rate,
      currency: org.currency,
    }
    return { ok: true, data: [sellerKpiStats] }
  } catch (err) {
    console.error("Error fetching seller KPI stats:", err)
    return returnError(err) as ResponseData<SellerKpiStats[]>
  }
}
export async function getSellerKpiTimeSeries(
  orgId: string,
  year?: number,
  month?: number
): Promise<ResponseData<SellerKpiTimeSeries[]>> {
  try {
    const org = await getOrgAuth(orgId)
    const { linkIds } = await getOrgAffiliateLinks(org, orgId)
    if (!linkIds.length) return { ok: true, data: [] }
    const data = await getTimeSeriesData<SellerKpiTimeSeries>(
      linkIds,
      year,
      month
    )
    return { ok: true, data }
  } catch (err) {
    console.error("Error fetching seller KPI time series:", err)
    return returnError(err) as ResponseData<SellerKpiTimeSeries[]>
  }
}
export async function getSellerReferrer(
  orgId: string,
  year?: number,
  month?: number
): Promise<ResponseData<SellerReferrerStat[]>> {
  try {
    const org = await getOrgAuth(orgId)
    const { linkIds } = await getOrgAffiliateLinks(org, orgId)
    const referrerStats = await getReferrerStats(linkIds, year, month)
    return { ok: true, data: referrerStats }
  } catch (err) {
    console.error("Error fetching seller referrer:", err)
    return returnError(err) as ResponseData<SellerReferrerStat[]>
  }
}
export async function getTopAffiliates(
  orgId: string,
  year?: number,
  month?: number
): Promise<ResponseData<AffiliateStats[]>> {
  try {
    const org = await getOrgAuth(orgId)
    const TopAffiliateStats = (await getTopAffiliatesByConversionRate(
      orgId,
      year,
      month
    )) as AffiliateStats[]
    const converted = await convertedCurrency<AffiliateStats>(
      org.currency,
      TopAffiliateStats
    )
    return { ok: true, data: converted }
  } catch (err) {
    console.error("Error fetching top affiliates:", err)
    return returnError(err) as ResponseData<AffiliateStats[]>
  }
}
