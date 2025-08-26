import React, { Suspense } from "react"
import ResetPassword from "@/components/pages/Reset-password"
import { OrgIdProps } from "@/lib/types/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"

const resetPasswordPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPassword orgId={orgId} affiliate />
      </Suspense>
    </>
  )
}
export default resetPasswordPage
