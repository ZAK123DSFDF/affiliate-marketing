import React from "react"
import { OrgIdProps } from "@/lib/types/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import SocialTrafficCharts from "@/components/ui-custom/Chart/DataSourceChart"
import { getAffiliateReferrers } from "@/app/affiliate/[orgId]/dashboard/action"
import { ErrorCard } from "@/components/ui-custom/ErrorCard"
import { requireAffiliateWithOrg } from "@/lib/server/authGuards"
const referrersPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await requireAffiliateWithOrg(orgId)
  const referrerStats = await getAffiliateReferrers(orgId)
  if (!referrerStats.ok) {
    return <ErrorCard message={referrerStats.error || "Something went wrong"} />
  }
  return (
    <>
      <SocialTrafficCharts
        orgId={orgId}
        affiliate
        referrerStats={referrerStats.data}
      />
    </>
  )
}
export default referrersPage
