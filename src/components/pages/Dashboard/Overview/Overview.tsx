"use client";

import Cards from "@/components/ui-custom/Cards/Cards";
import { ChartDailyMetrics } from "@/components/ui-custom/Chart/SalesChart";
import SocialTrafficCharts from "@/components/ui-custom/Chart/DataSourceChart";
import AffiliatesTable from "@/components/pages/Dashboard/Affiliates/Affiliates";
import { dummyAffiliateTopRankData } from "@/lib/types/dummyAffiliateTopRank";
import React from "react";

const Overview = () => {
  return (
    <div className="space-y-8">
      <Cards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-full">
          <ChartDailyMetrics />
        </div>
        <div className="h-full">
          <SocialTrafficCharts />
        </div>
      </div>
      <AffiliatesTable
        data={dummyAffiliateTopRankData}
        cardTitle="Top Affiliates"
      />
    </div>
  );
};

export default Overview;
