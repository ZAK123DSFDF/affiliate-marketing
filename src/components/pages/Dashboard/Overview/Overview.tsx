"use client";

import Cards from "@/components/pages/Dashboard/Overview/Cards/Cards";
import { ChartDailyMetrics } from "@/components/pages/Dashboard/Overview/Chart/SalesChart";
import SocialTrafficCharts from "@/components/pages/Dashboard/Overview/Chart/DataSourceChart";
import AffiliatesTable from "@/components/pages/Dashboard/Affiliates/Affiliates";
import { dummyAffiliateTopRankData } from "@/lib/types/dummyAffiliateTopRank";

const Overview = () => {
  return (
    <div className="space-y-8">
      <Cards />
      <ChartDailyMetrics />
      <SocialTrafficCharts />
      <AffiliatesTable data={dummyAffiliateTopRankData} />
    </div>
  );
};

export default Overview;
