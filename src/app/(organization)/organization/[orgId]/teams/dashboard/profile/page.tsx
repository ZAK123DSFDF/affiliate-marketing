import React from "react"
import Profile from "@/components/pages/Dashboard/Profile/Profile"
import { OrgIdProps } from "@/lib/types/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { ErrorCard } from "@/components/ui-custom/ErrorCard"
import { requireTeamWithOrg } from "@/lib/server/authGuards"
import { getTeamData } from "@/app/(organization)/organization/[orgId]/teams/dashboard/profile/action"

const profilePage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await requireTeamWithOrg(orgId)
  const userResponse = await getTeamData(orgId)
  if (!userResponse.ok) {
    return <ErrorCard message={userResponse.error || "Something went wrong"} />
  }
  return (
    <>
      <Profile affiliate={false} orgId={orgId} UserData={userResponse.data} />
    </>
  )
}
export default profilePage
