import React from "react"
import { OrgIdProps } from "@/lib/types/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import SocialTrafficCharts from "@/components/ui-custom/Chart/DataSourceChart"
import { getSellerReferrer } from "@/app/(seller)/seller/[orgId]/dashboard/action"
import { ErrorCard } from "@/components/ui-custom/ErrorCard"
const referrersPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  const referrerStats = await getSellerReferrer(orgId)
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
