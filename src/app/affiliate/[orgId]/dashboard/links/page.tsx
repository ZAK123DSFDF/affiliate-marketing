import React from "react"
import Links from "@/components/pages/AffiliateDashboard/Links/Links"
import { getAffiliateLinksWithStats } from "@/app/affiliate/[orgId]/dashboard/links/action"
import { redirect } from "next/navigation"
import { validateOrg } from "@/util/ValidateOrg"
import { OrgIdProps } from "@/lib/types/orgId"

const linksPage = async ({ params }: OrgIdProps) => {
  const { orgId } = await params
  const org = await validateOrg(orgId)

  if (!org.orgFound) {
    redirect(`/affiliate/${orgId}/not-found`)
  }
  const links = await getAffiliateLinksWithStats()
  if (!links.ok) {
    redirect(`/error?message=${encodeURIComponent(links.error)}`)
  }
  return (
    <>
      <Links orgId={orgId} affiliate data={links.data} />
    </>
  )
}
export default linksPage
