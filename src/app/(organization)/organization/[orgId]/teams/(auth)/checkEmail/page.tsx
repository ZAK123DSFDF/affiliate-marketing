import React from "react"
import CheckEmail from "@/components/pages/CheckEmail"
import { redirectIfAuthed, redirectTeamIfAuthed } from "@/lib/server/authGuards"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { OrgIdProps } from "@/lib/types/orgId"

const CheckEmailPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await redirectTeamIfAuthed(orgId)
  return (
    <>
      <CheckEmail affiliate={false} />
    </>
  )
}
export default CheckEmailPage
