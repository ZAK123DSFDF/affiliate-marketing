import React from "react"
import StripeSuccess from "@/components/pages/StripeSuccess"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { requireOrganizationWithOrg } from "@/lib/server/authGuards"
import { OrgIdProps } from "@/lib/types/orgId"

const stripeSuccessPage = async ({
  params,
  searchParams,
}: OrgIdProps & { searchParams: Promise<{ account?: string }> }) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await requireOrganizationWithOrg(orgId)
  const { account } = await searchParams
  return (
    <>
      <StripeSuccess account={account} />
    </>
  )
}
export default stripeSuccessPage
