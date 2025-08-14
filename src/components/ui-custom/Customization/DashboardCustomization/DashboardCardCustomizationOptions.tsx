"use client";

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch";
import React from "react";
import { useDashboardCardCustomizationOption } from "@/hooks/useDashboardCustomization";
import { updateDashboardCustomization } from "@/customization/Dashboard/DashboardCustomizationChanges";

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
  } = useDashboardCardCustomizationOption();

  return (
    <OptionWithSwitch
      triggerSize={triggerSize}
      dropdownSize={dropdownSize}
      properties={{
        shadow: {
          label: "Enable Card Shadow",
          enabled: dashboardCardShadow,
          onToggle: (val) =>
            updateDashboardCustomization(
              "useDashboardCardCustomization",
              "dashboardCardShadow",
              val,
            ),
          children: {
            shadowColor: {
              label: "Shadow Color",
              value: dashboardCardShadowColor,
              onChange: (val) =>
                updateDashboardCustomization(
                  "useDashboardCardCustomization",
                  "dashboardCardShadowColor",
                  val,
                ),
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
                updateDashboardCustomization(
                  "useDashboardCardCustomization",
                  "dashboardCardShadowThickness",
                  val,
                ),
            },
          },
        },
        border: {
          label: "Enable Card Border",
          enabled: dashboardCardBorder,
          onToggle: (val) =>
            updateDashboardCustomization(
              "useDashboardCardCustomization",
              "dashboardCardBorder",
              val,
            ),
          children: {
            borderColor: {
              label: "Border Color",
              value: dashboardCardBorderColor,
              onChange: (val) =>
                updateDashboardCustomization(
                  "useDashboardCardCustomization",
                  "dashboardCardBorderColor",
                  val,
                ),
            },
          },
        },
        backgroundColor: {
          label: "Card Background Color",
          value: dashboardCardBackgroundColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useDashboardCardCustomization",
              "dashboardCardBackgroundColor",
              val,
            ),
        },
      }}
    />
  );
};
