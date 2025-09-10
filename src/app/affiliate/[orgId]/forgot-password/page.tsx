import React from "react"
import ForgotPassword from "@/components/pages/Forgot-password"
import { OrgIdProps } from "@/lib/types/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { redirectIfAffiliateAuthed } from "@/lib/server/authGuards"

const forgetPasswordPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await redirectIfAffiliateAuthed()
  return (
    <>
      <ForgotPassword orgId={orgId} affiliate />
    </>
  )
}
export default forgetPasswordPage
