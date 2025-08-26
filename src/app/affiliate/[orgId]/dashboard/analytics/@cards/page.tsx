import React from "react"
import { OrgIdProps } from "@/lib/types/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import Cards from "@/components/ui-custom/Cards/Cards"
import { getAffiliateKpiStats } from "@/app/affiliate/[orgId]/dashboard/action"
import { redirect } from "next/navigation"

const cardsPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  const kpiCardStats = await getAffiliateKpiStats()
  if (!kpiCardStats.ok) {
    redirect(`/error?message=${encodeURIComponent(kpiCardStats.error)}`)
  }
  return (
    <>
      <Cards orgId={orgId} affiliate kpiCardStats={kpiCardStats.data} />
    </>
  )
}
export default cardsPage
