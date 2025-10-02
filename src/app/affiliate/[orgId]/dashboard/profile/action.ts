// app/actions/auth/getUser.ts
"use server"

import { returnError } from "@/lib/errorHandler"
import { ResponseData } from "@/lib/types/response"
import {
  SafeAffiliateData,
  SafeAffiliateWithCapabilities,
} from "@/lib/types/authAffiliate"
import { revalidatePath } from "next/cache"
import { getAffiliateOrganization } from "@/lib/server/GetAffiliateOrganization"
import { updateAffiliatePasswordAction } from "@/lib/server/updateAffiliatePassword"
import { validateAffiliatePasswordAction } from "@/lib/server/validateAffiliatePassword"
import { updateAffiliateProfileAction } from "@/lib/server/updateAffiliateProfile"
import { getAffiliateDataAction } from "@/lib/server/getAffiliateData"
import { getPayoutEmailMethod } from "@/lib/server/getPayoutEmailMethod"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getAffiliateAuthCapabilities } from "@/lib/server/getAffiliateAuthCapabilities"

export const getAffiliateData = async (
  orgId: string
): Promise<ResponseData<SafeAffiliateWithCapabilities>> => {
  try {
    const decoded = await getAffiliateOrganization(orgId)
    const { canChangeEmail, canChangePassword } =
      await getAffiliateAuthCapabilities(orgId)
    const affiliateData = await getAffiliateDataAction(decoded)
    return {
      ok: true,
      data: { ...affiliateData, canChangeEmail, canChangePassword },
    }
  } catch (err) {
    console.error("getAffiliate error:", err)
    return returnError(err) as ResponseData<SafeAffiliateWithCapabilities>
  }
}
export const getAffiliatePaymentMethod = async (
  orgId: string
): Promise<ResponseData<AffiliatePaymentMethod>> => {
  try {
    const decoded = await getAffiliateOrganization(orgId)
    const paypalMethod = await getPayoutEmailMethod(decoded)
    return {
      ok: true,
      data: { paypalEmail: paypalMethod?.accountIdentifier ?? null },
    }
  } catch (err) {
    console.error("getAffiliatePayout error:", err)
    return returnError(err) as ResponseData<AffiliatePaymentMethod>
  }
}
export async function updateAffiliateProfile(
  orgId: string,
  data: {
    name?: string
    paypalEmail?: string
  }
) {
  try {
    const decoded = await getAffiliateOrganization(orgId)
    await updateAffiliateProfileAction(decoded, data)
    revalidatePath(`/affiliate/${orgId}/dashboard/profile`)
    return { ok: true }
  } catch (err) {
    console.error("updateAffiliateProfile error:", err)
    return returnError(err)
  }
}

export async function validateCurrentPassword(
  orgId: string,
  currentPassword: string
) {
  try {
    const decoded = await getAffiliateOrganization(orgId)
    await validateAffiliatePasswordAction(decoded, currentPassword)
    return { ok: true }
  } catch (err) {
    console.error("validateCurrentPassword error:", err)
    return returnError(err)
  }
}
export async function updateAffiliatePassword(
  orgId: string,
  newPassword: string
) {
  try {
    const decoded = await getAffiliateOrganization(orgId)
    const { canChangePassword } = await getAffiliateAuthCapabilities(orgId)
    if (!canChangePassword) {
      throw { status: 403, toast: "This account cannot change password" }
    }
    await updateAffiliatePasswordAction(decoded, newPassword)

    return { ok: true }
  } catch (err) {
    console.error("updateAffiliatePassword error:", err)
    return returnError(err)
  }
}
export async function logoutAction(affiliate: boolean, orgId?: string) {
  const cookieStore = await cookies()

  if (affiliate && orgId) {
    cookieStore.set(`affiliateToken-${orgId}`, "", { maxAge: -1 })
    return { ok: true, redirectTo: `/affiliate/${orgId}/login` }
  } else {
    cookieStore.set("sellerToken", "", { maxAge: -1 })
    return { ok: true, redirectTo: "/login" }
  }
}
