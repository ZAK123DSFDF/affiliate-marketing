import React from "react"
import Teams from "@/components/pages/Dashboard/Teams/Teams"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { requireOrganizationWithOrg } from "@/lib/server/authGuards"
import { OrgIdProps } from "@/lib/types/orgId"
import { getUserPlan } from "@/lib/server/getUserPlan"

const TeamsPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await requireOrganizationWithOrg(orgId)
  const plan = await getUserPlan()
  return (
    <>
      <Teams affiliate={false} orgId={orgId} plan={plan} />
    </>
  )
}
export default TeamsPage
