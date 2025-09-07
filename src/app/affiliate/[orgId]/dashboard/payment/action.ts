// actions/getAffiliateCommissionByMonth.ts
"use server"
import { getAffiliateOrganization } from "@/lib/server/GetAffiliateOrganization"
import { AffiliatePaymentRow } from "@/lib/types/affiliatePaymentRow"
import { ResponseData } from "@/lib/types/response"
import { returnError } from "@/lib/errorHandler"
import { getAffiliateCommissionByMonthAction } from "@/lib/server/getAffiliateCommissionByMonth"
import { getOrganization } from "@/lib/server/getOrganization"
import { ExchangeRate } from "@/util/ExchangeRate"

export const getAffiliateCommissionByMonth = async (
  year?: number
): Promise<ResponseData<AffiliatePaymentRow[]>> => {
  try {
    const decoded = await getAffiliateOrganization()
    const targetYear = year ?? new Date().getFullYear()
    const rows = await getAffiliateCommissionByMonthAction(decoded, targetYear)
    const org = await getOrganization(decoded.orgId)
    const rate = await ExchangeRate(org.currency)
    const convertedRows: AffiliatePaymentRow[] = rows.map((row) => ({
      ...row,
      totalCommission: (row.totalCommission ?? 0) * rate,
      paidCommission: (row.paidCommission ?? 0) * rate,
      unpaidCommission: (row.unpaidCommission ?? 0) * rate,
      currency: org.currency,
    }))
    return { ok: true, data: convertedRows }
  } catch (err) {
    console.error("getAffiliateCommissionByMonth error:", err)
    return returnError(err) as ResponseData<AffiliatePaymentRow[]>
  }
}
