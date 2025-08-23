"use server"
import { returnError } from "@/lib/errorHandler"
import { ResponseData } from "@/lib/types/response"
import { UnpaidMonth } from "@/lib/types/unpaidMonth"
import { getOrgAuth } from "@/lib/server/GetOrgAuth"
import { AffiliatePayout } from "@/lib/types/affiliateStats"
import { getAffiliatePayoutBulkAction } from "@/lib/server/getAffiliatePayoutBulk"
import { getUnpaidPayoutAction } from "@/lib/server/getUnpaidPayout"
import { getAffiliatePayoutAction } from "@/lib/server/getAffiliatePayout"
import { OrderBy, OrderDir } from "@/lib/types/orderTypes"
export async function getAffiliatePayouts(
  orgId: string,
  year?: number,
  month?: number,
  orderBy?: OrderBy,
  orderDir?: OrderDir,
  offset?: number,
  email?: string
): Promise<ResponseData<AffiliatePayout[]>> {
  try {
    await getOrgAuth(orgId)
    const rows = (await getAffiliatePayoutAction(
      orgId,
      year,
      month,
      orderBy === "none" ? undefined : orderBy,
      orderDir,
      10,
      offset,
      email
    )) as AffiliatePayout[]
    console.log("getAffiliatePayouts rows:", rows)
    return { ok: true, data: rows }
  } catch (err) {
    console.error("getAffiliatePayouts error:", err)
    return returnError(err) as ResponseData<AffiliatePayout[]>
  }
}
export async function getAffiliatePayoutsBulk(
  orgId: string,
  months: { month: number; year: number }[],
  orderBy?: OrderBy,
  orderDir?: OrderDir,
  offset?: number,
  email?: string
): Promise<ResponseData<AffiliatePayout[]>> {
  try {
    await getOrgAuth(orgId)
    const rows = (await getAffiliatePayoutBulkAction(
      orgId,
      months,
      orderBy === "none" ? undefined : orderBy,
      orderDir,
      10,
      offset,
      email
    )) as AffiliatePayout[]
    return { ok: true, data: rows }
  } catch (err) {
    console.error("getAffiliatePayoutsBulk error:", err)
    return returnError(err) as ResponseData<AffiliatePayout[]>
  }
}

export async function getUnpaidMonths(
  orgId: string
): Promise<ResponseData<UnpaidMonth[]>> {
  try {
    await getOrgAuth(orgId)
    const rows = await getUnpaidPayoutAction(orgId)

    return {
      ok: true,
      data: rows.map((row) => ({
        month: row.month,
        year: row.year,
        unpaid: row.unpaid,
      })),
    }
  } catch (e) {
    return returnError(e) as ResponseData<UnpaidMonth[]>
  }
}
