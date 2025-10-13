import React from "react"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { requireSellerWithOrg } from "@/lib/server/authGuards"
import { OrgIdProps } from "@/lib/types/orgId"
import StripeError from "@/components/pages/StripeError"

const stripeErrorPage = async ({
  params,
  searchParams,
}: OrgIdProps & { searchParams: Promise<{ message?: string }> }) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await requireSellerWithOrg(orgId)
  const { message } = await searchParams
  return (
    <>
      <StripeError message={message} />
    </>
  )
}
export default stripeErrorPage
