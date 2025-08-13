"use client";
import React from "react";
import Cards from "@/components/ui-custom/Cards/Cards";
import SocialTrafficCharts from "@/components/ui-custom/Chart/DataSourceChart";
import { ChartDailyMetrics } from "@/components/ui-custom/Chart/SalesChart";
import Links from "@/components/pages/AffiliateDashboard/Links/Links";
import { dummyLinksData } from "@/lib/types/dummyLInksData";
import { useCustomizationSync } from "@/hooks/useCustomizationSync";
import PendingState from "@/components/ui-custom/PendingState";
import ErrorState from "@/components/ui-custom/ErrorState";

const AffiliateOverview = ({
  orgId,
  isPreview = false,
  affiliate = false,
}: {
  orgId: string;
  isPreview?: boolean;
  affiliate: boolean;
}) => {
  const { isPending, isError, refetch } = affiliate
    ? useCustomizationSync(orgId, "dashboard")
    : { isPending: false, isError: false, refetch: () => {} };
  if (isPending) {
    return <PendingState withoutBackground />;
  }
  if (isError) {
    return <ErrorState onRetry={refetch} />;
  }
  return (
    <div className="space-y-8">
      <Cards affiliate={affiliate} isPreview={isPreview} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-full">
          <ChartDailyMetrics affiliate={affiliate} isPreview={isPreview} />
        </div>
        <div className="h-full">
          <SocialTrafficCharts isPreview={isPreview} affiliate={affiliate} />
        </div>
      </div>

      <Links
        data={dummyLinksData}
        affiliate={affiliate}
        isTopLinksView
        isPreview={isPreview}
        orgId={orgId}
      />
    </div>
  );
};

export default AffiliateOverview;
