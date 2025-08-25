import React from "react"
import { OrgIdProps } from "@/lib/types/orgId"
import { redirect } from "next/navigation"
import { getAffiliateCommissionByMonth } from "@/app/affiliate/[orgId]/dashboard/payment/action"
import PaymentTable from "@/components/pages/AffiliateDashboard/Payment/Payment"
import { MissingPaypalEmailCard } from "@/components/ui-custom/MissingPayoutEmailCard"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { ErrorCard } from "@/components/ui-custom/ErrorCard"

const paymentPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  const res = await getAffiliateCommissionByMonth()
  if (!res.ok) {
    return <ErrorCard message={res.error || "Something went wrong"} />
  }
  return (
    <div className="space-y-6">
      <MissingPaypalEmailCard orgId={orgId} />
      <PaymentTable orgId={orgId} affiliate data={res.data} />
    </div>
  )
}
export default paymentPage
