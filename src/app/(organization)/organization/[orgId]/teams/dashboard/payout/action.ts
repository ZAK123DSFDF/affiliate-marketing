"use server"
import { ResponseData } from "@/lib/types/response"
import { UnpaidMonth } from "@/lib/types/unpaidMonth"
import { AffiliatePayout } from "@/lib/types/affiliateStats"
import { getAffiliatePayoutBulkAction } from "@/lib/server/getAffiliatePayoutBulk"
import { getUnpaidPayoutAction } from "@/lib/server/getUnpaidPayout"
import { getAffiliatePayoutAction } from "@/lib/server/getAffiliatePayout"
import { OrderBy, OrderDir } from "@/lib/types/orderTypes"
import { convertedCurrency } from "@/util/ConvertedCurrency"
import { handleAction } from "@/lib/handleAction"

import {
  createOrganizationAffiliatePayout,
  CreatePayoutInput,
} from "@/lib/organizationAction/createOrganizationAffiliatePayout"
import { getTeamAuthAction } from "@/lib/server/getTeamAuthAction"
export async function getTeamAffiliatePayouts(
  orgId: string,
  year?: number,
  month?: number,
  orderBy?: OrderBy,
  orderDir?: OrderDir,
  offset?: number,
  email?: string
): Promise<ResponseData<AffiliatePayout[]>> {
  return handleAction("getAffiliatePayouts", async () => {
    const org = await getTeamAuthAction(orgId)
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
    const converted = await convertedCurrency<AffiliatePayout>(
      org.currency,
      rows
    )
    return { ok: true, data: converted }
  })
}
export async function getTeamAffiliatePayoutsBulk(
  orgId: string,
  months: { month: number; year: number }[],
  orderBy?: OrderBy,
  orderDir?: OrderDir,
  offset?: number,
  email?: string
): Promise<ResponseData<AffiliatePayout[]>> {
  return handleAction("getAffiliatePayoutsBulk", async () => {
    const org = await getTeamAuthAction(orgId)
    const rows = (await getAffiliatePayoutBulkAction(
      orgId,
      months,
      orderBy === "none" ? undefined : orderBy,
      orderDir,
      10,
      offset,
      email
    )) as AffiliatePayout[]
    const converted = await convertedCurrency<AffiliatePayout>(
      org.currency,
      rows
    )
    return { ok: true, data: converted }
  })
}

export async function getTeamUnpaidMonths(
  orgId: string
): Promise<ResponseData<UnpaidMonth[]>> {
  return handleAction("getUnpaidMonths", async () => {
    await getTeamAuthAction(orgId)
    const rows = await getUnpaidPayoutAction(orgId)

    return {
      ok: true,
      data: rows.map((row) => ({
        month: row.month,
        year: row.year,
        unpaid: row.unpaid,
      })),
    }
  })
}

export async function createTeamAffiliatePayouts({
  orgId,
  affiliateIds,
  isUnpaid,
  months,
}: CreatePayoutInput) {
  await getTeamAuthAction(orgId)
  await createOrganizationAffiliatePayout({
    orgId,
    affiliateIds,
    isUnpaid,
    months,
  })
}
