"use client"

import Cards from "@/components/ui-custom/Cards/Cards"
import { ChartDailyMetrics } from "@/components/ui-custom/Chart/SalesChart"
import SocialTrafficCharts from "@/components/ui-custom/Chart/DataSourceChart"
import AffiliatesTable from "@/components/pages/Dashboard/Affiliates/Affiliates"
import React from "react"

const Overview = ({ orgId }: { orgId: string }) => {
  return (
    <div className="space-y-8">
      <Cards orgId={orgId} affiliate={false} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-full">
          <ChartDailyMetrics orgId={orgId} affiliate={false} />
        </div>
        <div className="h-full">
          <SocialTrafficCharts orgId={orgId} affiliate={false} />
        </div>
      </div>
      <AffiliatesTable
        affiliate={false}
        orgId={orgId}
        cardTitle="Top Affiliates"
      />
    </div>
  )
}

export default Overview
