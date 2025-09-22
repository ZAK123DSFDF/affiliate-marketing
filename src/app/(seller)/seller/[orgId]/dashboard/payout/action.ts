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
import { convertedCurrency } from "@/util/ConvertedCurrency"
import { customAlphabet } from "nanoid"
import { payoutReference, payoutReferencePeriods } from "@/db/schema"
import { db } from "@/db/drizzle"
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
    const org = await getOrgAuth(orgId)
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
    const org = await getOrgAuth(orgId)
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
const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
const generateRefId = customAlphabet(alphabet, 8)

interface CreatePayoutInput {
  orgId: string
  affiliateIds: string[]
  isUnpaid: boolean
  months: { year: number; month?: number }[]
}
export async function createAffiliatePayouts({
  orgId,
  affiliateIds,
  isUnpaid,
  months,
}: CreatePayoutInput) {
  await getOrgAuth(orgId)
  if (affiliateIds.length === 0) return []
  const insertedRefs: { affiliateId: string; refId: string }[] =
    affiliateIds.map((affiliateId) => ({
      affiliateId,
      refId: generateRefId(),
    }))
  await db.insert(payoutReference).values(
    insertedRefs.map((r) => ({
      refId: r.refId,
      orgId,
      affiliateId: r.affiliateId,
      isUnpaid,
      createdAt: new Date(),
    }))
  )
  if (months.length > 0) {
    const periodsData = insertedRefs.flatMap((r) =>
      months.map((m) => ({
        refId: r.refId,
        year: m.year,
        month: m.month ?? 0,
      }))
    )

    await db.insert(payoutReferencePeriods).values(periodsData)
  }

  return insertedRefs
}
