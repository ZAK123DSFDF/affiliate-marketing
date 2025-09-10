import React from "react"
import { OrgIdProps } from "@/lib/types/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { ChartDailyMetrics } from "@/components/ui-custom/Chart/SalesChart"
import { getSellerKpiTimeSeries } from "@/app/(seller)/seller/[orgId]/dashboard/action"
import { ErrorCard } from "@/components/ui-custom/ErrorCard"
import { requireSellerWithOrg } from "@/lib/server/authGuards"

const chartsPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await requireSellerWithOrg(orgId)
  const sellerChartStats = await getSellerKpiTimeSeries(orgId)
  if (!sellerChartStats.ok) {
    return (
      <ErrorCard message={sellerChartStats.error || "Something went wrong"} />
    )
  }
  return (
    <>
      <ChartDailyMetrics
        orgId={orgId}
        affiliate={false}
        ChartStats={sellerChartStats.data}
      />
    </>
  )
}
export default chartsPage
