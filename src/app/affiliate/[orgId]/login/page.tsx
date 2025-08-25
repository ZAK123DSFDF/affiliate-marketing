import React from "react"
import Login from "@/components/pages/Login"
import { OrgIdProps } from "@/lib/types/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"

const AffiliateLoginPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  return (
    <>
      <Login affiliate orgId={orgId} />
    </>
  )
}
export default AffiliateLoginPage
