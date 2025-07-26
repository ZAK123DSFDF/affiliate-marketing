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
import {
  dashboardCustomizationSettings,
  localDashboardCustomizationSettings,
} from "@/lib/types/dashboardCustomization";
import { useMainBackgroundColor } from "@/store/useMainBackgroundColor";

export function DashboardCustomization() {
  const [selectedPage, setSelectedPage] = useState("dashboard");

  const [customization, setCustomization] =
    useState<localDashboardCustomizationSettings>({
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
  const { setMainBackgroundColor, mainBackgroundColor } =
    useMainBackgroundColor();
  const handleColorChange = (
    key: keyof localDashboardCustomizationSettings | "mainBackgroundColor",
    val: string,
  ) => {
    if (key === "mainBackgroundColor") {
      setMainBackgroundColor(val);
    } else {
      setCustomization((prev) => ({
        ...prev,
        [key]: val,
      }));
    }
  };
  const params = useParams();
  const orgId = params?.orgId as string;

  if (!orgId) {
    return <div className="text-red-500">Invalid organization ID</div>;
  }
  const colorInputs: {
    key: keyof localDashboardCustomizationSettings | "mainBackgroundColor";
    label: string;
  }[] = [
    { key: "sideBarBackgroundColor", label: "Sidebar Background Color" },
    { key: "sideBarActiveNavigationTextColor", label: "Active Nav Text Color" },
    {
      key: "sideBarInActiveNavigationTextColor",
      label: "Inactive Nav Text Color",
    },
    {
      key: "sideBarActiveNavigationBackgroundColor",
      label: "Active Nav Background",
    },
    {
      key: "sideBarHoverNavigationBackgroundColor",
      label: "Nav Hover Background",
    },
    {
      key: "sideBarHoverNavigationTextColor",
      label: "Nav Hover Text/Icon Color",
    },
    {
      key: "sideBarProfileBackgroundColor",
      label: "Sidebar Profile Background",
    },
    {
      key: "sideBarProfileTextPrimaryColor",
      label: "Sidebar Profile Text Color",
    },
    {
      key: "sideBarProfileTextSecondaryColor",
      label: "Sidebar Profile Secondary Text Color",
    },
    { key: "mainBackgroundColor", label: "Main Background Color" },
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {colorInputs.map(({ key, label }) => {
          const isMainBg = key === "mainBackgroundColor";
          const value = isMainBg
            ? mainBackgroundColor
            : customization[key as keyof localDashboardCustomizationSettings];

          return (
            <ResettableColorInput
              key={key}
              label={label}
              value={value}
              onChange={(val) => handleColorChange(key, val)}
            />
          );
        })}
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
          <div
            className="flex-1 p-6 overflow-y-auto"
            style={{
              backgroundColor: mainBackgroundColor || undefined,
            }}
          >
            {selectedPage === "dashboard" && <Dashboard />}
            {selectedPage === "links" && (
              <Links
                isPreview
                data={dummyAffiliateLinks}
                customization={customization}
              />
            )}
            {selectedPage === "payment" && (
              <PaymentTable
                isPreview
                data={dummyAffiliatePayments}
                customization={customization}
              />
            )}
            {selectedPage === "profile" && (
              <Profile
                AffiliateData={dummyProfileData}
                isPreview
                customization={customization}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
