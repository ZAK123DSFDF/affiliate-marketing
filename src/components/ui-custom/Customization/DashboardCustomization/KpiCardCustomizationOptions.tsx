"use client"

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch"
import { useAtom } from "jotai"
import { kpiCardCustomizationAtom } from "@/store/DashboardCustomizationAtom"
import { useThrottledOptionsUpdater } from "@/hooks/useThrottledOptionsUpdater"

export const KpiCardCustomizationOptions = ({
  triggerSize,
  dropdownSize,
}: {
  triggerSize?: string
  dropdownSize?: string
}) => {
  const [
    {
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
      kpiLoadingColor,
    },
    setKpiCardCustomization,
  ] = useAtom(kpiCardCustomizationAtom)
  const throttled = useThrottledOptionsUpdater(setKpiCardCustomization, 300)
  return (
    <OptionWithSwitch
      triggerSize={triggerSize}
      dropdownSize={dropdownSize}
      properties={{
        shadow: {
          label: "Enable Card Shadow",
          enabled: cardShadow,
          onToggle: throttled.cardShadow,
          children: {
            shadowColor: {
              label: "Shadow Color",
              value: cardShadowColor,
              onChange: throttled.cardShadowColor,
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
              onChange: throttled.cardShadowThickness,
            },
          },
        },
        border: {
          label: "Enable Card Border",
          enabled: cardBorder,
          onToggle: throttled.cardBorder,
          children: {
            borderColor: {
              label: "Border Color",
              value: cardBorderColor,
              onChange: throttled.cardBorderColor,
            },
          },
        },
        backgroundColor: {
          label: "Card Background Color",
          value: cardBackgroundColor,
          onChange: throttled.cardBackgroundColor,
        },
        primaryTextColor: {
          label: "Primary Text Color",
          value: cardPrimaryTextColor,
          onChange: throttled.cardPrimaryTextColor,
        },
        secondaryTextColor: {
          label: "Secondary Text Color",
          value: cardSecondaryTextColor,
          onChange: throttled.cardSecondaryTextColor,
        },
        iconPrimaryColor: {
          label: "Icon Primary Color",
          value: cardIconPrimaryColor,
          onChange: throttled.cardIconPrimaryColor,
        },
        iconSecondaryColor: {
          label: "Icon Secondary Color",
          value: cardIconSecondaryColor,
          onChange: throttled.cardIconSecondaryColor,
        },
        iconTertiaryColor: {
          label: "Icon Tertiary Color",
          value: cardIconTertiaryColor,
          onChange: throttled.cardIconTertiaryColor,
        },
        iconPrimaryBackgroundColor: {
          label: "Icon Primary Background",
          value: cardIconPrimaryBackgroundColor,
          onChange: throttled.cardIconPrimaryBackgroundColor,
        },
        iconSecondaryBackgroundColor: {
          label: "Icon Secondary Background",
          value: cardIconSecondaryBackgroundColor,
          onChange: throttled.cardIconSecondaryBackgroundColor,
        },
        iconTertiaryBackgroundColor: {
          label: "Icon Tertiary Background",
          value: cardIconTertiaryBackgroundColor,
          onChange: throttled.cardIconTertiaryBackgroundColor,
        },
        loadingColor: {
          label: "KPI Loading Color",
          value: kpiLoadingColor,
          onChange: throttled.kpiLoadingColor,
        },
      }}
    />
  )
}
