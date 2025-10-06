"use client"
import React from "react"
import Cards from "@/components/ui-custom/Cards/Cards"
import SocialTrafficCharts from "@/components/ui-custom/Chart/DataSourceChart"
import { ChartDailyMetrics } from "@/components/ui-custom/Chart/SalesChart"

const AffiliateOverview = ({
  orgId,
  isPreview = false,
  affiliate = false,
}: {
  orgId: string
  isPreview?: boolean
  affiliate: boolean
}) => {
  return (
    <div className="space-y-8">
      <Cards orgId={orgId} affiliate={affiliate} isPreview={isPreview} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-full">
          <ChartDailyMetrics
            orgId={orgId}
            affiliate={affiliate}
            isPreview={isPreview}
          />
        </div>
        <div className="h-full">
          <SocialTrafficCharts
            orgId={orgId}
            isPreview={isPreview}
            affiliate={affiliate}
          />
        </div>
      </div>
    </div>
  )
}

export default AffiliateOverview
