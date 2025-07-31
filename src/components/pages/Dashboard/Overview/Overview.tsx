"use client";

import Cards from "@/components/ui-custom/Cards/Cards";
import { ChartDailyMetrics } from "@/components/ui-custom/Chart/SalesChart";
import SocialTrafficCharts from "@/components/ui-custom/Chart/DataSourceChart";
import AffiliatesTable from "@/components/pages/Dashboard/Affiliates/Affiliates";
import { dummyAffiliateTopRankData } from "@/lib/types/dummyAffiliateTopRank";

const Overview = () => {
  return (
    <div className="space-y-8">
      <Cards />
      <ChartDailyMetrics />
      <SocialTrafficCharts />
      <AffiliatesTable
        data={dummyAffiliateTopRankData}
        cardTitle="Top Affiliates"
      />
    </div>
  );
};

export default Overview;
