import React from "react"
import AffiliatesTable from "@/components/pages/Dashboard/Affiliates/Affiliates"
import { OrgIdProps } from "@/lib/types/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { requireSellerWithOrg } from "@/lib/server/authGuards"

const affiliatePage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await requireSellerWithOrg(orgId)
  return (
    <>
      <AffiliatesTable
        affiliate={false}
        orgId={orgId}
        cardTitle="All Affiliates"
        showHeader
      />
    </>
  )
}
export default affiliatePage
