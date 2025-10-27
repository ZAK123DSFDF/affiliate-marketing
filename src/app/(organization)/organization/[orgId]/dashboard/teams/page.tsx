import React from "react"
import Teams from "@/components/pages/Dashboard/Teams/Teams"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { requireOrganizationWithOrg } from "@/lib/server/authGuards"
import { OrgIdProps } from "@/lib/types/orgId"

const TeamsPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await requireOrganizationWithOrg(orgId)
  return (
    <>
      <Teams affiliate={false} orgId={orgId} />
    </>
  )
}
export default TeamsPage
