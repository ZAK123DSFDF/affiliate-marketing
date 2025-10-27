import React from "react"
import Signup from "@/components/pages/Signup"
import { OrgIdProps } from "@/lib/types/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { redirectIfAffiliateAuthed } from "@/lib/server/authGuards"
const TeamSignupPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  return (
    <>
      <Signup affiliate={false} orgId={orgId} />
    </>
  )
}
export default TeamSignupPage
