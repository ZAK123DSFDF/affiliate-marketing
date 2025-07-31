"use client";
import React from "react";
import Cards from "@/components/ui-custom/Cards/Cards";
import SocialTrafficCharts from "@/components/ui-custom/Chart/DataSourceChart";
import { ChartDailyMetrics } from "@/components/ui-custom/Chart/SalesChart";
import Links from "@/components/pages/AffiliateDashboard/Links/Links";
import { dummyLinksData } from "@/lib/types/dummyLInksData";

const AffiliateOverview = ({ isPreview = false }: { isPreview?: boolean }) => {
  return (
    <div className="space-y-8">
      <Cards affiliate isPreview={isPreview} />
      <ChartDailyMetrics affiliate />
      <SocialTrafficCharts />
      <Links data={dummyLinksData} isTopLinksView />
    </div>
  );
};
export default AffiliateOverview;
