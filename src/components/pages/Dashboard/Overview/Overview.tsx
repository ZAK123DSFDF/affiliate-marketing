"use client";

import Cards from "@/components/ui-custom/Cards/Cards";
import { ChartDailyMetrics } from "@/components/ui-custom/Chart/SalesChart";
import SocialTrafficCharts from "@/components/ui-custom/Chart/DataSourceChart";
import AffiliatesTable from "@/components/pages/Dashboard/Affiliates/Affiliates";
import { dummyAffiliateTopRankData } from "@/lib/types/dummyAffiliateTopRank";
import React from "react";
import { SellerKpiStats } from "@/lib/types/affiliateKpiStats";
import { SellerKpiTimeSeries } from "@/lib/types/affiliateChartStats";
import { SellerReferrerStat } from "@/lib/types/affiliateReferrerStat";

const Overview = ({
  orgId,
  kpiCardStats,
  referrerStats,
  ChartStats,
  TopAffiliates,
}: {
  orgId: string;
  kpiCardStats: SellerKpiStats[];
  referrerStats: SellerReferrerStat[];
  ChartStats: SellerKpiTimeSeries[];
  TopAffiliates: any[];
}) => {
  return (
    <div className="space-y-8">
      <Cards orgId={orgId} kpiCardStats={kpiCardStats} affiliate={false} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-full">
          <ChartDailyMetrics
            ChartStats={ChartStats}
            orgId={orgId}
            affiliate={false}
          />
        </div>
        <div className="h-full">
          <SocialTrafficCharts
            referrerStats={referrerStats}
            orgId={orgId}
            affiliate={false}
          />
        </div>
      </div>
      <AffiliatesTable
        orgId={orgId}
        data={TopAffiliates}
        cardTitle="Top Affiliates"
      />
    </div>
  );
};

export default Overview;
