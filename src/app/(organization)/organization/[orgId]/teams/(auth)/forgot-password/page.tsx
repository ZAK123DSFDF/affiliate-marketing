import React from "react"
import ForgotPassword from "@/components/pages/Forgot-password"
import { redirectIfAuthed, redirectTeamIfAuthed } from "@/lib/server/authGuards"
import { OrgIdProps } from "@/lib/types/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"

const forgetPasswordPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await redirectTeamIfAuthed(orgId)
  return (
    <>
      <ForgotPassword affiliate={false} isTeam orgId={orgId} />
    </>
  )
}
export default forgetPasswordPage
