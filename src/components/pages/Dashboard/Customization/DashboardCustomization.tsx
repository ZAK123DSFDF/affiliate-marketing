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
  ColorCustomizationSettings,
  localDashboardCustomizationSettings,
} from "@/lib/types/dashboardCustomization";
import {
  useDashboardCustomizationStore,
  useDashboardThemeCustomization,
} from "@/store/useDashboardCustomizationStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import AffiliateOverview from "@/components/pages/AffiliateDashboard/AffiliateOverview/AffiliateOverview";
import { ThemeCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/ThemeCustomizationOptions";
import { useDashboardThemeCustomizationOption } from "@/hooks/useDashboardCustomization";
import { DashboardThemeCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/DashboardThemeCustomizationOptions";

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
      cardShadow: "sm",
      cardBorder: false,
      cardBorderColor: "",
      cardBackgroundColor: "",
      cardShadowColor: "",
      headerNameColor: "",
      headerDescColor: "",
      buttonBackgroundColor: "",
      buttonTextColor: "",
      buttonDisabledBackgroundColor: "",
      buttonDisabledTextColor: "",
      tableBorderColor: "",
      tableHeaderTextColor: "",
      tableHoverBackgroundColor: "",
      tableIconColor: "",
      tableIconHoverColor: "",
      tableIconHoverBackgroundColor: "",
      tableRowPrimaryTextColor: "",
      tableRowSecondaryTextColor: "",
      tableRowTertiaryTextColor: "",
      tableRowBadgeOverDueTextColor: "",
      tableRowBadgeOverDueBackgroundColor: "",
      tableRowBadgePendingTextColor: "",
      tableRowBadgePendingBackgroundColor: "",
      tableRowBadgePaidTextColor: "",
      tableRowBadgePaidBackgroundColor: "",
      separatorColor: "",
      dialogBackgroundColor: "",
      dialogCloseIconColor: "",
      dialogCloseIconBorderColor: "",
      yearSelectBackgroundColor: "",
      yearSelectTextColor: "",
      yearSelectActiveBorderColor: "",
      yearSelectDropDownBackgroundColor: "",
      yearSelectDropDownTextColor: "",
      yearSelectDropDownActiveTextColor: "",
      yearSelectDropDownActiveBackgroundColor: "",
      yearSelectDropDownIconColor: "",
      yearSelectDropDownHoverBackgroundColor: "",
      yearSelectDropDownHoverTextColor: "",
    });
  const { mainBackgroundColor } = useDashboardThemeCustomizationOption();

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
    { key: "cardBackgroundColor", label: "Card Background Color" },
    { key: "cardShadowColor", label: "Card Shadow Color" },
    {
      key: "cardBorderColor",
      label: "Card Border Color",
    },
    { key: "headerNameColor", label: "Header Title Color" },
    { key: "headerDescColor", label: "Header Description Color" },
    { key: "buttonBackgroundColor", label: "Button Background Color" },
    { key: "buttonTextColor", label: "Button Text Color" },
    {
      key: "buttonDisabledBackgroundColor",
      label: "Button Disabled Background Color",
    },
    {
      key: "buttonDisabledTextColor",
      label: "Button Disabled Text Color",
    },
    { key: "tableBorderColor", label: "Table Border Color" },
    { key: "tableHeaderTextColor", label: "Table Header Text Color" },
    { key: "tableHoverBackgroundColor", label: "Table Hover Background Color" },
    { key: "tableIconColor", label: "Table Icon Color" },
    { key: "tableIconHoverColor", label: "Table Icon Hover Color" },
    {
      key: "tableIconHoverBackgroundColor",
      label: "Table Icon Hover Background",
    },
    { key: "tableRowPrimaryTextColor", label: "Table Row Primary Text Color" },
    {
      key: "tableRowSecondaryTextColor",
      label: "Table Row Secondary Text Color",
    },
    {
      key: "tableRowTertiaryTextColor",
      label: "Table Row Tertiary Text Color",
    },
    {
      key: "tableRowBadgeOverDueTextColor",
      label: "Table Row Badge Overdue Text Color",
    },
    {
      key: "tableRowBadgeOverDueBackgroundColor",
      label: "Table Row Badge Overdue Background Color",
    },
    {
      key: "tableRowBadgePendingTextColor",
      label: "Table Row Badge Pending Text Color",
    },
    {
      key: "tableRowBadgePendingBackgroundColor",
      label: "Table Row Badge Pending Background Color",
    },
    {
      key: "tableRowBadgePaidTextColor",
      label: "Table Row Badge Paid Text Color",
    },
    {
      key: "tableRowBadgePaidBackgroundColor",
      label: "Table Row Badge Paid Background Color",
    },
    { key: "separatorColor", label: "Separator Color" },
    { key: "dialogBackgroundColor", label: "Dialog Background Color" },
    { key: "dialogCloseIconColor", label: "Dialog Close Icon Color" },
    {
      key: "dialogCloseIconBorderColor",
      label: "Dialog Close Icon Border Color",
    },
    { key: "yearSelectBackgroundColor", label: "Year Select Background Color" },
    { key: "yearSelectTextColor", label: "Year Select Text Color" },
    {
      key: "yearSelectActiveBorderColor",
      label: "Year Select Active Border Color",
    },
    {
      key: "yearSelectDropDownBackgroundColor",
      label: "Year Select Dropdown Background Color",
    },
    {
      key: "yearSelectDropDownTextColor",
      label: "Year Select Dropdown Text Color",
    },
    {
      key: "yearSelectDropDownActiveTextColor",
      label: "Year Select Dropdown Active Text Color",
    },
    {
      key: "yearSelectDropDownActiveBackgroundColor",
      label: "Year Select Dropdown Active Background Color",
    },
    {
      key: "yearSelectDropDownIconColor",
      label: "Year Select Dropdown Icon Color",
    },
    {
      key: "yearSelectDropDownHoverBackgroundColor",
      label: "Year Select Dropdown Hover Background Color",
    },
    {
      key: "yearSelectDropDownHoverTextColor",
      label: "Year Select Dropdown Hover Text Color",
    },
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Label>Shadow Thickness</Label>
        <Select value={customization.cardShadow}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select shadow thickness" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="sm">Small</SelectItem>
            <SelectItem value="md">Medium</SelectItem>
            <SelectItem value="lg">Large</SelectItem>
            <SelectItem value="xl">Extra Large</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center space-x-2 mt-4">
          <Switch id="card-border" checked={customization.cardBorder} />
          <Label htmlFor="card-border">Enable Card Border</Label>
        </div>
        {colorInputs.map(({ key, label }) => {
          const isMainBg = key === "mainBackgroundColor";
          const value = isMainBg
            ? mainBackgroundColor
            : customization[key as keyof ColorCustomizationSettings];
          return (
            <ResettableColorInput
              key={key}
              label={label}
              value={value}
              onChange={(val) => {
                console.log("hi");
              }}
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
            <DashboardThemeCustomizationOptions name="mainBackgroundColor" />
            {selectedPage === "dashboard" && <AffiliateOverview isPreview />}
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
