import React from "react"
import ForgotPassword from "@/components/pages/Forgot-password"
import { validateOrg } from "@/util/ValidateOrg"
import { redirect } from "next/navigation"
import { OrgIdProps } from "@/lib/types/orgId"

const forgetPasswordPage = async () => {
  return (
    <>
      <ForgotPassword affiliate={false} />
    </>
  )
}
export default forgetPasswordPage
