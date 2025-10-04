import React from "react"
import Signup from "@/components/pages/Signup"
import { OrgIdProps } from "@/lib/types/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { redirectIfAffiliateAuthed } from "@/lib/server/authGuards"
import { getOrg } from "@/lib/server/getOrg"
const AffiliateSignupPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await redirectIfAffiliateAuthed(orgId)
  return (
    <>
      <Signup affiliate orgId={orgId} />
    </>
  )
}
export default AffiliateSignupPage
