import React from "react"
import Login from "@/components/pages/Login"
import { OrgIdProps } from "@/lib/types/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { redirectIfAffiliateAuthed } from "@/lib/server/authGuards"

const AffiliateLoginPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await redirectIfAffiliateAuthed(orgId)
  return (
    <>
      <Login affiliate orgId={orgId} />
    </>
  )
}
export default AffiliateLoginPage
