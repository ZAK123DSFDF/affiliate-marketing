// app/dashboard/page.tsx
import { redirect } from "next/navigation"
import { OrgIdProps } from "@/lib/types/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { getBaseUrl } from "@/lib/server/getBaseUrl"
import { buildAffiliateUrl } from "@/util/Url"

export default async function DashboardPage({ params }: OrgIdProps) {
  const orgId = await getValidatedOrgFromParams({ params })
  const baseUrl = await getBaseUrl()
  const redirectUrl = buildAffiliateUrl({
    path: "dashboard/analytics",
    organizationId: orgId,
    baseUrl,
    partial: true,
  })
  redirect(redirectUrl)
}
