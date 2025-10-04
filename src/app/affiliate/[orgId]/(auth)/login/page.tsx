import React from "react"
import Login from "@/components/pages/Login"
import { OrgIdProps } from "@/lib/types/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { redirectIfAffiliateAuthed } from "@/lib/server/authGuards"
import { getOrg } from "@/lib/server/getOrg"

const AffiliateLoginPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await redirectIfAffiliateAuthed(orgId)
  const org = await getOrg(orgId)
  return (
    <>
      <Login affiliate orgId={orgId} org={org} />
    </>
  )
}
export default AffiliateLoginPage
