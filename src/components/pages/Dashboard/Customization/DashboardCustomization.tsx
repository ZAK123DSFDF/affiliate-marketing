"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import AffiliateDashboardSidebar from "@/components/AffiliateDashboardSidebar";
import Profile from "@/components/pages/Dashboard/Profile/Profile";
import PaymentTable from "@/components/pages/AffiliateDashboard/Payment/Payment";
import Links from "@/components/pages/AffiliateDashboard/Links/Links";
import {
  dummyAffiliateLinks,
  dummyAffiliatePayments,
  dummyProfileData,
} from "@/lib/types/previewData";
import AffiliateOverview from "@/components/pages/AffiliateDashboard/AffiliateOverview/AffiliateOverview";
import { useDashboardThemeCustomizationOption } from "@/hooks/useDashboardCustomization";
import { DashboardThemeCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/DashboardThemeCustomizationOptions";

export function DashboardCustomization() {
  const [selectedPage, setSelectedPage] = useState("dashboard");

  const { mainBackgroundColor } = useDashboardThemeCustomizationOption();

  const params = useParams();
  const orgId = params?.orgId as string;

  if (!orgId) {
    return <div className="text-red-500">Invalid organization ID</div>;
  }
  return (
    <div className="space-y-6">
      <div className="border rounded-xl overflow-hidden shadow-lg ring ring-muted bg-background max-w-5xl h-[500px] mx-auto relative">
        <div className="flex h-full">
          <AffiliateDashboardSidebar
            affiliate
            orgId={orgId}
            isPreview
            currentPage={selectedPage}
            onSelectPage={(page: any) => setSelectedPage(page)}
          />
          <div
            className="flex-1 p-6 overflow-y-auto"
            style={{
              backgroundColor: mainBackgroundColor || undefined,
            }}
          >
            <DashboardThemeCustomizationOptions name="mainBackgroundColor" />
            {selectedPage === "dashboard" && (
              <AffiliateOverview affiliate isPreview />
            )}
            {selectedPage === "links" && (
              <Links affiliate isPreview data={dummyAffiliateLinks} />
            )}
            {selectedPage === "payment" && (
              <PaymentTable affiliate isPreview data={dummyAffiliatePayments} />
            )}
            {selectedPage === "profile" && (
              <Profile
                orgId="1234"
                affiliate
                AffiliateData={dummyProfileData}
                isPreview
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
