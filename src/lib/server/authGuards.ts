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

  if (!decoded.orgId) {
    redirect("/create-company")
  }

  if (paramsOrgId && decoded.orgId !== paramsOrgId) {
    redirect(`/seller/${decoded.orgId}/dashboard/analytics`)
  }

  return decoded
}

export async function redirectIfAuthed() {
  const decoded = await getSellerAuth()

  if (decoded) {
    if (decoded.orgId) {
      redirect(`/seller/${decoded.orgId}/dashboard/analytics`)
    } else {
      redirect("/create-company")
    }
  }

  return null
}

// 🔹 Affiliate Guards
export async function requireAffiliateWithOrg(
  paramsOrgId?: string
): Promise<AffiliateTokenPayload> {
  const decoded = await getAffiliateAuth()

  if (!decoded) {
    redirect(`/affiliate/${paramsOrgId}/login`)
  }

  if (paramsOrgId && decoded.orgId !== paramsOrgId) {
    // Prevent cross-org access
    redirect(`/affiliate/${decoded.orgId}/dashboard`)
  }

  return decoded
}

export async function redirectIfAffiliateAuthed() {
  const decoded = await getAffiliateAuth()

  if (decoded) {
    redirect(`/affiliate/${decoded.orgId}/dashboard`)
  }

  return null
}
