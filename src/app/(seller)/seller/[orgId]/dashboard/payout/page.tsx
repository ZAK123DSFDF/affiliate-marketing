import React from "react"
import { OrgIdProps } from "@/lib/types/orgId"
import { getAffiliatePayouts } from "@/app/(seller)/seller/[orgId]/dashboard/payout/action"
import PayoutTable from "@/components/pages/Dashboard/Payouts/PayoutTable"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { ErrorCard } from "@/components/ui-custom/ErrorCard"
import { requireSellerWithOrg } from "@/lib/server/authGuards"

const payoutPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await requireSellerWithOrg(orgId)
  const res = await getAffiliatePayouts(orgId)
  if (!res.ok) {
    return <ErrorCard message={res.error || "Something went wrong"} />
  }
  return (
    <>
      <PayoutTable affiliate={false} data={res.data} orgId={orgId} />
    </>
  )
}
export default payoutPage
