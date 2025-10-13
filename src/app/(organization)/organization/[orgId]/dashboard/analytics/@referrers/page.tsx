import React from "react"
import { OrgIdProps } from "@/lib/types/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import SocialTrafficCharts from "@/components/ui-custom/Chart/DataSourceChart"
import { requireSellerWithOrg } from "@/lib/server/authGuards"
const referrersPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await requireSellerWithOrg(orgId)
  return (
    <>
      <SocialTrafficCharts orgId={orgId} affiliate={false} />
    </>
  )
}
export default referrersPage
