import React from "react"
import { OrgIdProps } from "@/lib/types/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { ChartDailyMetrics } from "@/components/ui-custom/Chart/SalesChart"
import { getAffiliateKpiTimeSeries } from "@/app/affiliate/[orgId]/dashboard/action"
import { ErrorCard } from "@/components/ui-custom/ErrorCard"
import { requireAffiliateWithOrg } from "@/lib/server/authGuards"

const chartsPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await requireAffiliateWithOrg(orgId)
  const affiliateChartStats = await getAffiliateKpiTimeSeries(orgId)
  if (!affiliateChartStats.ok) {
    return (
      <ErrorCard
        message={affiliateChartStats.error || "Something went wrong"}
      />
    )
  }
  return (
    <>
      <ChartDailyMetrics
        orgId={orgId}
        affiliate
        ChartStats={affiliateChartStats.data}
      />
    </>
  )
}
export default chartsPage
