import React from "react"
import Login from "@/components/pages/Login"
import { redirectIfAuthed, redirectTeamIfAuthed } from "@/lib/server/authGuards"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { OrgIdProps } from "@/lib/types/orgId"

const loginPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await redirectTeamIfAuthed(orgId)
  return (
    <>
      <Login affiliate={false} isTeam orgId={orgId} />
    </>
  )
}
export default loginPage
