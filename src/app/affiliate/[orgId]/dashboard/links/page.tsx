import React from "react"
import Links from "@/components/pages/AffiliateDashboard/Links/Links"
import { getAffiliateLinksWithStats } from "@/app/affiliate/[orgId]/dashboard/links/action"
import { redirect } from "next/navigation"
import { OrgIdProps } from "@/lib/types/orgId"
import { MissingPaypalEmailCard } from "@/components/ui-custom/MissingPayoutEmailCard"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { ErrorCard } from "@/components/ui-custom/ErrorCard"

const linksPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  const links = await getAffiliateLinksWithStats()
  if (!links.ok) {
    return <ErrorCard message={links.error || "Something went wrong"} />
  }
  return (
    <div className="space-y-6">
      <MissingPaypalEmailCard orgId={orgId} />
      <Links orgId={orgId} affiliate data={links.data} />
    </div>
  )
}
export default linksPage
