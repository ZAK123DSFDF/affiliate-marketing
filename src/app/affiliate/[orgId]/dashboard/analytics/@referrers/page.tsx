import React from "react"
import { OrgIdProps } from "@/lib/types/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import SocialTrafficCharts from "@/components/ui-custom/Chart/DataSourceChart"
import { getAffiliateReferrers } from "@/app/affiliate/[orgId]/dashboard/action"
import { redirect } from "next/navigation"
const referrersPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  const referrerStats = await getAffiliateReferrers()
  if (!referrerStats.ok) {
    redirect(`/error?message=${encodeURIComponent(referrerStats.error)}`)
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
