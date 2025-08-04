"use client";

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch";
import React from "react";
import { useDashboardCardCustomizationOption } from "@/hooks/useDashboardCustomization";

export const DashboardCardCustomizationOptions = ({
  triggerSize,
  dropdownSize,
}: {
  triggerSize?: string;
  dropdownSize?: string;
}) => {
  const {
    dashboardCardShadow,
    dashboardCardShadowColor,
    dashboardCardBorder,
    dashboardCardBorderColor,
    dashboardCardBackgroundColor,
    dashboardCardShadowThickness,
    setDashboardCardColor,
    setDashboardCardSwitch,
  } = useDashboardCardCustomizationOption();

  return (
    <OptionWithSwitch
      triggerSize={triggerSize}
      dropdownSize={dropdownSize}
      properties={{
        shadow: {
          label: "Enable Card Shadow",
          enabled: dashboardCardShadow,
          onToggle: (val) => setDashboardCardSwitch("dashboardCardShadow", val),
          children: {
            shadowColor: {
              label: "Shadow Color",
              value: dashboardCardShadowColor,
              onChange: (val) =>
                setDashboardCardColor("dashboardCardShadowColor", val),
            },
            shadowThickness: {
              label: "Shadow Thickness",
              value: dashboardCardShadowThickness,
              options: [
                { label: "Small", value: "sm" },
                { label: "Medium", value: "md" },
                { label: "Large", value: "lg" },
                { label: "Extra Large", value: "xl" },
              ],
              onChange: (val) =>
                setDashboardCardColor("dashboardCardShadowThickness", val),
            },
          },
        },
        border: {
          label: "Enable Card Border",
          enabled: dashboardCardBorder,
          onToggle: (val) => setDashboardCardSwitch("dashboardCardBorder", val),
          children: {
            borderColor: {
              label: "Border Color",
              value: dashboardCardBorderColor,
              onChange: (val) =>
                setDashboardCardColor("dashboardCardBorderColor", val),
            },
          },
        },
        backgroundColor: {
          label: "Card Background Color",
          value: dashboardCardBackgroundColor,
          onChange: (val) =>
            setDashboardCardColor("dashboardCardBackgroundColor", val),
        },
      }}
    />
  );
};
