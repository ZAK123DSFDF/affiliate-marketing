"use client";

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch";
import React from "react";
import { useSidebarCustomizationOption } from "@/hooks/useDashboardCustomization";

export const SidebarCustomizationOptions = ({
  triggerSize,
  dropdownSize,
}: {
  triggerSize?: string;
  dropdownSize?: string;
}) => {
  const {
    sideBarBackgroundColor,
    sideBarActiveNavigationTextColor,
    sideBarInActiveNavigationTextColor,
    sideBarActiveNavigationBackgroundColor,
    sideBarHoverNavigationBackgroundColor,
    sideBarHoverNavigationTextColor,
    sideBarProfileBackgroundColor,
    sideBarProfileTextPrimaryColor,
    sideBarProfileTextSecondaryColor,
    setSidebarColor,
  } = useSidebarCustomizationOption();

  return (
    <OptionWithSwitch
      triggerSize={triggerSize}
      dropdownSize={dropdownSize}
      properties={{
        sideBarBackgroundColor: {
          label: "Sidebar Background",
          value: sideBarBackgroundColor,
          onChange: (val) => setSidebarColor("sideBarBackgroundColor", val),
        },
        sideBarActiveNavigationTextColor: {
          label: "Active Nav Text",
          value: sideBarActiveNavigationTextColor,
          onChange: (val) =>
            setSidebarColor("sideBarActiveNavigationTextColor", val),
        },
        sideBarInActiveNavigationTextColor: {
          label: "Inactive Nav Text",
          value: sideBarInActiveNavigationTextColor,
          onChange: (val) =>
            setSidebarColor("sideBarInActiveNavigationTextColor", val),
        },
        sideBarActiveNavigationBackgroundColor: {
          label: "Active Nav Background",
          value: sideBarActiveNavigationBackgroundColor,
          onChange: (val) =>
            setSidebarColor("sideBarActiveNavigationBackgroundColor", val),
        },
        sideBarHoverNavigationBackgroundColor: {
          label: "Hover Nav Background",
          value: sideBarHoverNavigationBackgroundColor,
          onChange: (val) =>
            setSidebarColor("sideBarHoverNavigationBackgroundColor", val),
        },
        sideBarHoverNavigationTextColor: {
          label: "Hover Nav Text",
          value: sideBarHoverNavigationTextColor,
          onChange: (val) =>
            setSidebarColor("sideBarHoverNavigationTextColor", val),
        },
        sideBarProfileBackgroundColor: {
          label: "Profile Background",
          value: sideBarProfileBackgroundColor,
          onChange: (val) =>
            setSidebarColor("sideBarProfileBackgroundColor", val),
        },
        sideBarProfileTextPrimaryColor: {
          label: "Profile Text Primary",
          value: sideBarProfileTextPrimaryColor,
          onChange: (val) =>
            setSidebarColor("sideBarProfileTextPrimaryColor", val),
        },
        sideBarProfileTextSecondaryColor: {
          label: "Profile Text Secondary",
          value: sideBarProfileTextSecondaryColor,
          onChange: (val) =>
            setSidebarColor("sideBarProfileTextSecondaryColor", val),
        },
      }}
    />
  );
};
