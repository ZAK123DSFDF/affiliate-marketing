"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import AffiliateDashboardSidebar from "@/components/AffiliateDashboardSidebar";
import Dashboard from "@/components/pages/Dashboard/Dashboard";
import Profile from "@/components/pages/Dashboard/Profile/Profile";
import PaymentTable from "@/components/pages/AffiliateDashboard/Payment/Payment";
import Links from "@/components/pages/AffiliateDashboard/Links/Links";
import {
  dummyAffiliateLinks,
  dummyAffiliatePayments,
  dummyProfileData,
} from "@/lib/types/previewData";
import { Label } from "@/components/ui/label";
import { ResettableColorInput } from "@/components/ui-custom/ResettableColorInput";
import { dashboardCustomizationSettings } from "@/lib/types/dashboardCustomization";

export function DashboardCustomization() {
  const [selectedPage, setSelectedPage] = useState("dashboard");

  const [customization, setCustomization] =
    useState<dashboardCustomizationSettings>({
      sideBarBackgroundColor: "",
      sideBarActiveNavigationTextColor: "",
      sideBarInActiveNavigationTextColor: "",
      sideBarActiveNavigationBackgroundColor: "",
      sideBarHoverNavigationBackgroundColor: "",
      sideBarHoverNavigationTextColor: "",
      sideBarProfileBackgroundColor: "",
      sideBarProfileTextPrimaryColor: "",
      sideBarProfileTextSecondaryColor: "",
    });

  const handleChange = (key: keyof typeof customization, value: string) => {
    setCustomization((prev) => ({ ...prev, [key]: value }));
  };

  const params = useParams();
  const orgId = params?.orgId as string;

  if (!orgId) {
    return <div className="text-red-500">Invalid organization ID</div>;
  }
  const colorInputs: [keyof dashboardCustomizationSettings, string][] = [
    ["sideBarBackgroundColor", "Sidebar Background Color"],
    ["sideBarActiveNavigationTextColor", "Active Nav Text Color"],
    ["sideBarInActiveNavigationTextColor", "Inactive Nav Text Color"],
    ["sideBarActiveNavigationBackgroundColor", "Active Nav Background"],
    ["sideBarHoverNavigationBackgroundColor", "Nav Hover Background"],
    ["sideBarHoverNavigationTextColor", "Nav Hover Text/Icon Color"],
    ["sideBarProfileBackgroundColor", "Sidebar Profile Background"],
    ["sideBarProfileTextPrimaryColor", "Sidebar Profile Text Color"],
    [
      "sideBarProfileTextSecondaryColor",
      "Sidebar Profile Secondary Text Color",
    ],
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {colorInputs.map(([key, label]) => (
          <ResettableColorInput
            key={key}
            label={label}
            value={customization[key]}
            onChange={(val) => handleChange(key, val)}
          />
        ))}
      </div>
      <div className="border rounded-xl overflow-hidden shadow-lg ring ring-muted bg-background max-w-5xl h-[500px] mx-auto relative">
        <div className="flex h-full">
          <AffiliateDashboardSidebar
            orgId={orgId}
            isPreview
            currentPage={selectedPage}
            onSelectPage={(page: any) => setSelectedPage(page)}
            customization={customization}
          />
          <div className="flex-1 p-6 overflow-y-auto">
            {selectedPage === "dashboard" && <Dashboard />}
            {selectedPage === "links" && (
              <Links isPreview data={dummyAffiliateLinks} />
            )}
            {selectedPage === "payment" && (
              <PaymentTable isPreview data={dummyAffiliatePayments} />
            )}
            {selectedPage === "profile" && (
              <Profile AffiliateData={dummyProfileData} isPreview />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
