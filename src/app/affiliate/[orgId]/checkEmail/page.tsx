import React from "react"
import { OrgIdProps } from "@/lib/types/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import CheckEmail from "@/components/pages/CheckEmail"

const CheckEmailPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  return (
    <>
      <CheckEmail affiliate orgId={orgId} />
    </>
  )
}
export default CheckEmailPage
