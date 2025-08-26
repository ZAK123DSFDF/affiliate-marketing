import React from "react"
import { OrgIdProps } from "@/lib/types/orgId"
import { getAffiliatePayouts } from "@/app/seller/[orgId]/dashboard/payout/action"
import PayoutTable from "@/components/pages/Dashboard/Payouts/PayoutTable"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { ErrorCard } from "@/components/ui-custom/ErrorCard"

const payoutPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
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
