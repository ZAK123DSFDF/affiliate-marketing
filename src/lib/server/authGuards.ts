// lib/server/authGuards.ts
import { redirect } from "next/navigation"
import {
  getOrganizationAuth,
  OrganizationTokenPayload,
} from "@/lib/server/getOrganizationAuth"
import {
  AffiliateTokenPayload,
  getAffiliateAuth,
} from "@/lib/server/getAffiliateAuth"
import { getBaseUrl } from "@/lib/server/getBaseUrl"
import { buildAffiliateUrl } from "@/util/Url"

export async function requireOrganizationWithOrg(
  paramsOrgId?: string
): Promise<OrganizationTokenPayload> {
  const decoded = await getOrganizationAuth()

  if (!decoded) {
    redirect("/login")
  }

  if (!decoded.orgIds || decoded.orgIds.length === 0) {
    redirect("/create-company")
  }
  if (!paramsOrgId && decoded.activeOrgId) {
    redirect(`/organization/${decoded.activeOrgId}/dashboard/analytics`)
  }
  if (paramsOrgId && !decoded.orgIds.includes(paramsOrgId)) {
    redirect(
      `/organization/${decoded.activeOrgId ?? decoded.orgIds[0]}/dashboard/analytics`
    )
  }

  return decoded
}

export async function redirectIfAuthed() {
  const decoded = await getOrganizationAuth()

  if (decoded) {
    if (decoded.activeOrgId) {
      redirect(`/organization/${decoded.activeOrgId}/dashboard/analytics`)
    }
    if (decoded.orgIds && decoded.orgIds.length > 0) {
      redirect(`/organization/${decoded.orgIds[0]}/dashboard/analytics`)
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
  const baseUrl = await getBaseUrl()
  const login = buildAffiliateUrl({
    path: "login",
    organizationId: paramsOrgId,
    baseUrl,
    partial: true,
  })

  if (!decoded) {
    redirect(login)
  }
  const dashboard = buildAffiliateUrl({
    path: "dashboard",
    organizationId: decoded.orgId,
    baseUrl,
    partial: true,
  })
  if (paramsOrgId && decoded.orgId !== paramsOrgId) {
    // Prevent cross-org access
    redirect(dashboard)
  }

  return decoded
}

export async function redirectIfAffiliateAuthed(orgId: string) {
  const decoded = await getAffiliateAuth(orgId)
  const baseUrl = await getBaseUrl()
  const dashboard = buildAffiliateUrl({
    path: "dashboard",
    organizationId: orgId,
    baseUrl,
    partial: true,
  })
  if (decoded) {
    redirect(dashboard)
  }

  return null
}
