import React from "react"
import Login from "@/components/pages/Login"
import { validateOrg } from "@/util/ValidateOrg"
import { redirect } from "next/navigation"
import { OrgIdProps } from "@/lib/types/orgId"

const AffiliateLoginPage = async ({ params }: OrgIdProps) => {
  const { orgId } = await params
  const org = await validateOrg(orgId)
  if (!org.orgFound) {
    redirect(`/affiliate/${orgId}/not-found`)
  }
  return (
    <>
      <Login affiliate orgId={orgId} />
    </>
  )
}
export default AffiliateLoginPage
