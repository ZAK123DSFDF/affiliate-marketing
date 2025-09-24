import React from "react"
import EmailVerified from "@/components/pages/Email-verified"
import { OrgIdProps } from "@/lib/types/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { requireAffiliateWithOrg } from "@/lib/server/authGuards"

const emailVerifiedPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await requireAffiliateWithOrg(orgId)
  return (
    <>
      <EmailVerified orgId={orgId} affiliate />
    </>
  )
}
export default emailVerifiedPage
