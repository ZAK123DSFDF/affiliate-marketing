import React from "react"
import EmailVerified from "@/components/pages/Email-verified"
import { validateOrg } from "@/util/ValidateOrg"
import { redirect } from "next/navigation"
import { OrgIdProps } from "@/lib/types/orgId"

const emailVerifiedPage = async () => {
  return (
    <>
      <EmailVerified affiliate={false} />
    </>
  )
}
export default emailVerifiedPage
