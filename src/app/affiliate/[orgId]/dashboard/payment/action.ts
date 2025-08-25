// actions/getAffiliateCommissionByMonth.ts
"use server"
import { getAffiliateOrganization } from "@/lib/server/GetAffiliateOrganization"
import { AffiliatePaymentRow } from "@/lib/types/affiliatePaymentRow"
import { ResponseData } from "@/lib/types/response"
import { returnError } from "@/lib/errorHandler"
import { getAffiliateCommissionByMonthAction } from "@/lib/server/getAffiliateCommissionByMonth"

export const getAffiliateCommissionByMonth = async (
  year?: number
): Promise<ResponseData<AffiliatePaymentRow[]>> => {
  try {
    const decoded = await getAffiliateOrganization()
    const targetYear = year ?? new Date().getFullYear()
    const rows = await getAffiliateCommissionByMonthAction(decoded, targetYear)
    return { ok: true, data: rows }
  } catch (err) {
    console.error("getAffiliateCommissionByMonth error:", err)
    return returnError(err) as ResponseData<AffiliatePaymentRow[]>
  }
}
