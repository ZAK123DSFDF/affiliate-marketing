// app/actions/auth/getUser.ts
"use server"

import { returnError } from "@/lib/errorHandler"
import { ResponseData } from "@/lib/types/response"
import {
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
import { getAffiliateAuthCapabilities } from "@/lib/server/getAffiliateAuthCapabilities"
import { getBaseUrl } from "@/lib/server/getBaseUrl"
import { buildAffiliateUrl } from "@/util/Url"

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
    const baseUrl = await getBaseUrl()
    const revalidationPath = buildAffiliateUrl({
      path: "dashboard/profile",
      organizationId: orgId,
      baseUrl,
      partial: true,
    })
    revalidatePath(revalidationPath)
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
    cookieStore.delete(`affiliateToken-${orgId}`)
    const baseUrl = await getBaseUrl()
    const redirectUrl = buildAffiliateUrl({
      path: "login",
      organizationId: orgId,
      baseUrl,
      partial: true,
    })
    return { ok: true, redirectTo: redirectUrl }
  } else {
    cookieStore.delete("organizationToken")
    return { ok: true, redirectTo: "/login" }
  }
}
