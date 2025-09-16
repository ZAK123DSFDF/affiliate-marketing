// lib/server/authGuards.ts
import { redirect } from "next/navigation"
import { getSellerAuth, SellerTokenPayload } from "@/lib/server/getSellerAuth"
import {
  AffiliateTokenPayload,
  getAffiliateAuth,
} from "@/lib/server/getAffiliateAuth"

export async function requireSellerWithOrg(
  paramsOrgId?: string
): Promise<SellerTokenPayload> {
  const decoded = await getSellerAuth()

  if (!decoded) {
    redirect("/login")
  }

  if (!decoded.orgIds || decoded.orgIds.length === 0) {
    redirect("/create-company")
  }
  if (!paramsOrgId && decoded.activeOrgId) {
    redirect(`/seller/${decoded.activeOrgId}/dashboard/analytics`)
  }
  if (paramsOrgId && !decoded.orgIds.includes(paramsOrgId)) {
    redirect(
      `/seller/${decoded.activeOrgId ?? decoded.orgIds[0]}/dashboard/analytics`
    )
  }

  return decoded
}

export async function redirectIfAuthed() {
  const decoded = await getSellerAuth()

  if (decoded) {
    if (decoded.activeOrgId) {
      redirect(`/seller/${decoded.activeOrgId}/dashboard/analytics`)
    }
    if (decoded.orgIds && decoded.orgIds.length > 0) {
      redirect(`/seller/${decoded.orgIds[0]}/dashboard/analytics`)
    }
    redirect("/create-company")
  }

  return null
}

// 🔹 Affiliate Guards
export async function requireAffiliateWithOrg(
  paramsOrgId: string
): Promise<AffiliateTokenPayload> {
  const decoded = await getAffiliateAuth(paramsOrgId)

  if (!decoded) {
    redirect(`/affiliate/${paramsOrgId}/login`)
  }

  if (paramsOrgId && decoded.orgId !== paramsOrgId) {
    // Prevent cross-org access
    redirect(`/affiliate/${decoded.orgId}/dashboard`)
  }

  return decoded
}

export async function redirectIfAffiliateAuthed(orgId: string) {
  const decoded = await getAffiliateAuth(orgId)

  if (decoded) {
    redirect(`/affiliate/${decoded.orgId}/dashboard`)
  }

  return null
}
