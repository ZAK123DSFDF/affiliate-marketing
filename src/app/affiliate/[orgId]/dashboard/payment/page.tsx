import React from "react"
import { OrgIdProps } from "@/lib/types/orgId"
import PaymentTable from "@/components/pages/AffiliateDashboard/Payment/Payment"
import { MissingPaypalEmailCard } from "@/components/ui-custom/MissingPayoutEmailCard"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { requireAffiliateWithOrg } from "@/lib/server/authGuards"

const paymentPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await requireAffiliateWithOrg(orgId)
  return (
    <div className="space-y-6">
      <MissingPaypalEmailCard affiliate orgId={orgId} />
      <PaymentTable orgId={orgId} affiliate />
    </div>
  )
}
export default paymentPage
