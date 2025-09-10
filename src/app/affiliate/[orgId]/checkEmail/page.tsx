import React from "react"
import { OrgIdProps } from "@/lib/types/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import CheckEmail from "@/components/pages/CheckEmail"
import { redirectIfAffiliateAuthed } from "@/lib/server/authGuards"

const CheckEmailPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await redirectIfAffiliateAuthed()
  return (
    <>
      <CheckEmail affiliate orgId={orgId} />
    </>
  )
}
export default CheckEmailPage
