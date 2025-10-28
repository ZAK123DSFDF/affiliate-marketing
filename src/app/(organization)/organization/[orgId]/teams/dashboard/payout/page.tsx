import React from "react"
import { OrgIdProps } from "@/lib/types/orgId"
import PayoutTable from "@/components/pages/Dashboard/Payouts/PayoutTable"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { requireTeamWithOrg } from "@/lib/server/authGuards"

const payoutPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await requireTeamWithOrg(orgId)
  return (
    <>
      <PayoutTable affiliate={false} orgId={orgId} />
    </>
  )
}
export default payoutPage
