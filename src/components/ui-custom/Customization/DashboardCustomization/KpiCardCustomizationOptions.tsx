"use client";

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch";
import React from "react";
import { useKpiCardCustomizationOption } from "@/hooks/useDashboardCustomization";

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
    setCardColor,
    setCardSwitch,
  } = useKpiCardCustomizationOption();

  return (
    <OptionWithSwitch
      triggerSize={triggerSize}
      dropdownSize={dropdownSize}
      properties={{
        shadow: {
          label: "Enable Card Shadow",
          enabled: cardShadow,
          onToggle: (val) => setCardSwitch("cardShadow", val),
          children: {
            shadowColor: {
              label: "Shadow Color",
              value: cardShadowColor,
              onChange: (val) => setCardColor("cardShadowColor", val),
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
              onChange: (val) => setCardColor("cardShadowThickness", val),
            },
          },
        },
        border: {
          label: "Enable Card Border",
          enabled: cardBorder,
          onToggle: (val) => setCardSwitch("cardBorder", val),
          children: {
            borderColor: {
              label: "Border Color",
              value: cardBorderColor,
              onChange: (val) => setCardColor("cardBorderColor", val),
            },
          },
        },
        backgroundColor: {
          label: "Card Background Color",
          value: cardBackgroundColor,
          onChange: (val) => setCardColor("cardBackgroundColor", val),
        },
        primaryTextColor: {
          label: "Primary Text Color",
          value: cardPrimaryTextColor,
          onChange: (val) => setCardColor("cardPrimaryTextColor", val),
        },
        secondaryTextColor: {
          label: "Secondary Text Color",
          value: cardSecondaryTextColor,
          onChange: (val) => setCardColor("cardSecondaryTextColor", val),
        },
        iconPrimaryColor: {
          label: "Icon Primary Color",
          value: cardIconPrimaryColor,
          onChange: (val) => setCardColor("cardIconPrimaryColor", val),
        },
        iconSecondaryColor: {
          label: "Icon Secondary Color",
          value: cardIconSecondaryColor,
          onChange: (val) => setCardColor("cardIconSecondaryColor", val),
        },
        iconTertiaryColor: {
          label: "Icon Tertiary Color",
          value: cardIconTertiaryColor,
          onChange: (val) => setCardColor("cardIconTertiaryColor", val),
        },
        iconPrimaryBackgroundColor: {
          label: "Icon Primary Background",
          value: cardIconPrimaryBackgroundColor,
          onChange: (val) =>
            setCardColor("cardIconPrimaryBackgroundColor", val),
        },
        iconSecondaryBackgroundColor: {
          label: "Icon Secondary Background",
          value: cardIconSecondaryBackgroundColor,
          onChange: (val) =>
            setCardColor("cardIconSecondaryBackgroundColor", val),
        },
        iconTertiaryBackgroundColor: {
          label: "Icon Tertiary Background",
          value: cardIconTertiaryBackgroundColor,
          onChange: (val) =>
            setCardColor("cardIconTertiaryBackgroundColor", val),
        },
      }}
    />
  );
};
