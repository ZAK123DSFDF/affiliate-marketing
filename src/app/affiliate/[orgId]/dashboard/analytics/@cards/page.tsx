import React from "react"
import { OrgIdProps } from "@/lib/types/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import Cards from "@/components/ui-custom/Cards/Cards"
import { getAffiliateKpiStats } from "@/app/affiliate/[orgId]/dashboard/action"
import { ErrorCard } from "@/components/ui-custom/ErrorCard"
import { requireAffiliateWithOrg } from "@/lib/server/authGuards"

const cardsPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await requireAffiliateWithOrg(orgId)
  const kpiCardStats = await getAffiliateKpiStats(orgId)
  if (!kpiCardStats.ok) {
    return <ErrorCard message={kpiCardStats.error || "Something went wrong"} />
  }
  return (
    <>
      <Cards orgId={orgId} affiliate kpiCardStats={kpiCardStats.data} />
    </>
  )
}
export default cardsPage
