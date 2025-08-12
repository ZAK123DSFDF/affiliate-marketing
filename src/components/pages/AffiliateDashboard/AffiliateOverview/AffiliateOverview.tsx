"use client";
import React from "react";
import Cards from "@/components/ui-custom/Cards/Cards";
import SocialTrafficCharts from "@/components/ui-custom/Chart/DataSourceChart";
import { ChartDailyMetrics } from "@/components/ui-custom/Chart/SalesChart";
import Links from "@/components/pages/AffiliateDashboard/Links/Links";
import { dummyLinksData } from "@/lib/types/dummyLInksData";
import { defaultDashboardCustomization } from "@/customization/Dashboard/defaultDashboardCustomization";

const AffiliateOverview = ({
  isPreview = false,
  affiliate = false,
  dashboard,
}: {
  isPreview?: boolean;
  affiliate: boolean;
  dashboard?: typeof defaultDashboardCustomization;
}) => {
  return (
    <div className="space-y-8">
      <Cards
        affiliate={affiliate}
        isPreview={isPreview}
        dashboard={dashboard}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-full">
          <ChartDailyMetrics
            affiliate={affiliate}
            isPreview={isPreview}
            dashboard={dashboard}
          />
        </div>
        <div className="h-full">
          <SocialTrafficCharts
            isPreview={isPreview}
            affiliate={affiliate}
            dashboard={dashboard}
          />
        </div>
      </div>

      <Links
        data={dummyLinksData}
        affiliate={affiliate}
        isTopLinksView
        dashboard={dashboard}
        isPreview={isPreview}
      />
    </div>
  );
};

export default AffiliateOverview;
