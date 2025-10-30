import React from "react"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { OrgIdProps } from "@/lib/types/orgId"
import AffiliatesTable from "@/components/pages/Dashboard/Affiliates/Affiliates"
import { requireTeamWithOrg } from "@/lib/server/authGuards"

const topAffiliatesPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await requireTeamWithOrg(orgId)
  return (
    <>
      <AffiliatesTable
        affiliate={false}
        orgId={orgId}
        cardTitle="Top Affiliates"
        mode="top"
        isTeam
      />
    </>
  )
}
export default topAffiliatesPage
