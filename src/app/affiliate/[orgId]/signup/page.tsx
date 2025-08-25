import React from "react"
import Signup from "@/components/pages/Signup"
import { validateOrg } from "@/util/ValidateOrg"
import { redirect } from "next/navigation"
import { OrgIdProps } from "@/lib/types/orgId"
const AffiliateSignupPage = async ({ params }: OrgIdProps) => {
  const { orgId } = await params
  const org = await validateOrg(orgId)
  if (!org.orgFound) {
    redirect(`/affiliate/${orgId}/not-found`)
  }
  return (
    <>
      <Signup affiliate orgId={orgId} />
    </>
  )
}
export default AffiliateSignupPage
