import Overview from "@/components/pages/Dashboard/Overview/Overview"
import { validateOrg } from "@/util/ValidateOrg"
import { redirect } from "next/navigation"
import { OrgIdProps } from "@/lib/types/orgId"
import {
  getSellerKpiStats,
  getSellerKpiTimeSeries,
  getSellerReferrer,
  getTopAffiliates,
} from "@/app/seller/[orgId]/dashboard/action"

const DashboardPage = async ({ params }: OrgIdProps) => {
  const { orgId } = await params
  const org = await validateOrg(orgId)

  if (!org.orgFound) {
    redirect(`/affiliate/${orgId}/not-found`)
  }
  const kpiCardStats = await getSellerKpiStats(orgId)
  if (!kpiCardStats.ok) {
    redirect(`/error?message=${encodeURIComponent(kpiCardStats.error)}`)
  }
  const referrerStats = await getSellerReferrer(orgId)
  if (!referrerStats.ok) {
    redirect(`/error?message=${encodeURIComponent(referrerStats.error)}`)
  }
  const sellerChartStats = await getSellerKpiTimeSeries(orgId)
  if (!sellerChartStats.ok) {
    redirect(`/error?message=${encodeURIComponent(sellerChartStats.error)}`)
  }
  const TopAffiliates = await getTopAffiliates(orgId)
  if (!TopAffiliates.ok) {
    redirect(`/error?message=${encodeURIComponent(TopAffiliates.error)}`)
  }
  return (
    <>
      <Overview
        referrerStats={referrerStats.data}
        ChartStats={sellerChartStats.data}
        kpiCardStats={kpiCardStats.data}
        TopAffiliates={TopAffiliates.data}
        orgId={orgId}
      />
    </>
  )
}

export default DashboardPage
