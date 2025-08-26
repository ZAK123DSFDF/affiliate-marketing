import React from "react"
import { OrgIdProps } from "@/lib/types/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { ChartDailyMetrics } from "@/components/ui-custom/Chart/SalesChart"
import { getSellerKpiTimeSeries } from "@/app/seller/[orgId]/dashboard/action"
import { ErrorCard } from "@/components/ui-custom/ErrorCard"

const chartsPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
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
