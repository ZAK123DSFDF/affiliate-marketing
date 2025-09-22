import React from "react"
import { OrgIdProps } from "@/lib/types/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import SocialTrafficCharts from "@/components/ui-custom/Chart/DataSourceChart"
import { requireAffiliateWithOrg } from "@/lib/server/authGuards"
const referrersPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await requireAffiliateWithOrg(orgId)
  return (
    <>
      <SocialTrafficCharts orgId={orgId} affiliate />
    </>
  )
}
export default referrersPage
