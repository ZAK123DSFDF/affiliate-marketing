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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-full">
          <ChartDailyMetrics affiliate isPreview={isPreview} />
        </div>
        <div className="h-full">
          <SocialTrafficCharts isPreview={isPreview} />
        </div>
      </div>

      <Links data={dummyLinksData} isTopLinksView />
    </div>
  );
};

export default AffiliateOverview;
