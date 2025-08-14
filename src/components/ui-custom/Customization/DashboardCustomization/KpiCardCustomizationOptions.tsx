"use client";

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch";
import React from "react";
import { useKpiCardCustomizationOption } from "@/hooks/useDashboardCustomization";
import { updateDashboardCustomization } from "@/customization/Dashboard/DashboardCustomizationChanges";

export const KpiCardCustomizationOptions = ({
  triggerSize,
  dropdownSize,
}: {
  triggerSize?: string;
  dropdownSize?: string;
}) => {
  const {
    cardShadow,
    cardShadowColor,
    cardShadowThickness,
    cardBorder,
    cardBorderColor,
    cardPrimaryTextColor,
    cardSecondaryTextColor,
    cardIconPrimaryColor,
    cardIconSecondaryColor,
    cardIconTertiaryColor,
    cardIconPrimaryBackgroundColor,
    cardIconSecondaryBackgroundColor,
    cardIconTertiaryBackgroundColor,
    cardBackgroundColor,
  } = useKpiCardCustomizationOption();

  return (
    <OptionWithSwitch
      triggerSize={triggerSize}
      dropdownSize={dropdownSize}
      properties={{
        shadow: {
          label: "Enable Card Shadow",
          enabled: cardShadow,
          onToggle: (val) =>
            updateDashboardCustomization(
              "useKpiCardCustomization",
              "cardShadow",
              val,
            ),
          children: {
            shadowColor: {
              label: "Shadow Color",
              value: cardShadowColor,
              onChange: (val) =>
                updateDashboardCustomization(
                  "useKpiCardCustomization",
                  "cardShadowColor",
                  val,
                ),
            },
            shadowThickness: {
              label: "Shadow Thickness",
              value: cardShadowThickness,
              options: [
                { label: "Small", value: "sm" },
                { label: "Medium", value: "md" },
                { label: "Large", value: "lg" },
                { label: "Extra Large", value: "xl" },
              ],
              onChange: (val) =>
                updateDashboardCustomization(
                  "useKpiCardCustomization",
                  "cardShadowThickness",
                  val,
                ),
            },
          },
        },
        border: {
          label: "Enable Card Border",
          enabled: cardBorder,
          onToggle: (val) =>
            updateDashboardCustomization(
              "useKpiCardCustomization",
              "cardBorder",
              val,
            ),
          children: {
            borderColor: {
              label: "Border Color",
              value: cardBorderColor,
              onChange: (val) =>
                updateDashboardCustomization(
                  "useKpiCardCustomization",
                  "cardBorderColor",
                  val,
                ),
            },
          },
        },
        backgroundColor: {
          label: "Card Background Color",
          value: cardBackgroundColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useKpiCardCustomization",
              "cardBackgroundColor",
              val,
            ),
        },
        primaryTextColor: {
          label: "Primary Text Color",
          value: cardPrimaryTextColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useKpiCardCustomization",
              "cardPrimaryTextColor",
              val,
            ),
        },
        secondaryTextColor: {
          label: "Secondary Text Color",
          value: cardSecondaryTextColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useKpiCardCustomization",
              "cardSecondaryTextColor",
              val,
            ),
        },
        iconPrimaryColor: {
          label: "Icon Primary Color",
          value: cardIconPrimaryColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useKpiCardCustomization",
              "cardIconPrimaryColor",
              val,
            ),
        },
        iconSecondaryColor: {
          label: "Icon Secondary Color",
          value: cardIconSecondaryColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useKpiCardCustomization",
              "cardIconSecondaryColor",
              val,
            ),
        },
        iconTertiaryColor: {
          label: "Icon Tertiary Color",
          value: cardIconTertiaryColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useKpiCardCustomization",
              "cardIconTertiaryColor",
              val,
            ),
        },
        iconPrimaryBackgroundColor: {
          label: "Icon Primary Background",
          value: cardIconPrimaryBackgroundColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useKpiCardCustomization",
              "cardIconPrimaryBackgroundColor",
              val,
            ),
        },
        iconSecondaryBackgroundColor: {
          label: "Icon Secondary Background",
          value: cardIconSecondaryBackgroundColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useKpiCardCustomization",
              "cardIconSecondaryBackgroundColor",
              val,
            ),
        },
        iconTertiaryBackgroundColor: {
          label: "Icon Tertiary Background",
          value: cardIconTertiaryBackgroundColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useKpiCardCustomization",
              "cardIconTertiaryBackgroundColor",
              val,
            ),
        },
      }}
    />
  );
};
