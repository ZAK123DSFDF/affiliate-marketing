import React from "react"
import { OrgIdProps } from "@/lib/types/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { ChartDailyMetrics } from "@/components/ui-custom/Chart/SalesChart"
import { getAffiliateKpiTimeSeries } from "@/app/affiliate/[orgId]/dashboard/action"
import { redirect } from "next/navigation"

const chartsPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  const affiliateChartStats = await getAffiliateKpiTimeSeries()
  if (!affiliateChartStats.ok) {
    redirect(`/error?message=${encodeURIComponent(affiliateChartStats.error)}`)
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
