// app/dashboard/page.tsx
import AffiliateOverview from "@/components/pages/AffiliateDashboard/AffiliateOverview/AffiliateOverview"
import { redirect } from "next/navigation"
import { OrgIdProps } from "@/lib/types/orgId"
import {
  getAffiliateKpiStats,
  getAffiliateKpiTimeSeries,
  getAffiliateReferrers,
} from "@/app/affiliate/[orgId]/dashboard/action"
import { MissingPaypalEmailCard } from "@/components/ui-custom/MissingPayoutEmailCard"
import React from "react"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"

const DashboardPage = async ({ params }: OrgIdProps) => {
  const orgId = await getValidatedOrgFromParams({ params })
  const kpiCardStats = await getAffiliateKpiStats()
  if (!kpiCardStats.ok) {
    redirect(`/error?message=${encodeURIComponent(kpiCardStats.error)}`)
  }
  const referrerStats = await getAffiliateReferrers()
  if (!referrerStats.ok) {
    redirect(`/error?message=${encodeURIComponent(referrerStats.error)}`)
  }
  const affiliateChartStats = await getAffiliateKpiTimeSeries()
  if (!affiliateChartStats.ok) {
    redirect(`/error?message=${encodeURIComponent(affiliateChartStats.error)}`)
  }
  return (
    <div className="space-y-6">
      <MissingPaypalEmailCard orgId={orgId} />
      <AffiliateOverview
        kpiCardStats={kpiCardStats.data}
        affiliateChartStats={affiliateChartStats.data}
        referrerStats={referrerStats.data}
        affiliate
        orgId={orgId}
      />
    </div>
  )
}

export default DashboardPage
