import React from "react"
import EmailVerified from "@/components/pages/Email-verified"
import { validateOrg } from "@/util/ValidateOrg"
import { redirect } from "next/navigation"
import { OrgIdProps } from "@/lib/types/orgId"

const emailVerifiedPage = async ({ params }: OrgIdProps) => {
  const { orgId } = await params
  const org = await validateOrg(orgId)
  if (!org.orgFound) {
    redirect(`/affiliate/${orgId}/not-found`)
  }
  return (
    <>
      <EmailVerified orgId={orgId} affiliate />
    </>
  )
}
export default emailVerifiedPage
