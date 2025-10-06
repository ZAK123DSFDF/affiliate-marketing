"use client"

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch"
import { useAtom } from "jotai"
import { kpiCardCustomizationAtom } from "@/store/DashboardCustomizationAtom"

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

  return (
    <OptionWithSwitch
      triggerSize={triggerSize}
      dropdownSize={dropdownSize}
      properties={{
        shadow: {
          label: "Enable Card Shadow",
          enabled: cardShadow,
          onToggle: (val: boolean) =>
            setKpiCardCustomization((prev) => ({
              ...prev,
              cardShadow: val,
            })),
          children: {
            shadowColor: {
              label: "Shadow Color",
              value: cardShadowColor,
              onChange: (val: string) =>
                setKpiCardCustomization((prev) => ({
                  ...prev,
                  cardShadowColor: val,
                })),
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
              onChange: (val: string) =>
                setKpiCardCustomization((prev) => ({
                  ...prev,
                  cardShadowThickness: val,
                })),
            },
          },
        },
        border: {
          label: "Enable Card Border",
          enabled: cardBorder,
          onToggle: (val: boolean) =>
            setKpiCardCustomization((prev) => ({
              ...prev,
              cardBorder: val,
            })),
          children: {
            borderColor: {
              label: "Border Color",
              value: cardBorderColor,
              onChange: (val: string) =>
                setKpiCardCustomization((prev) => ({
                  ...prev,
                  cardBorderColor: val,
                })),
            },
          },
        },
        backgroundColor: {
          label: "Card Background Color",
          value: cardBackgroundColor,
          onChange: (val: string) =>
            setKpiCardCustomization((prev) => ({
              ...prev,
              cardBackgroundColor: val,
            })),
        },
        primaryTextColor: {
          label: "Primary Text Color",
          value: cardPrimaryTextColor,
          onChange: (val: string) =>
            setKpiCardCustomization((prev) => ({
              ...prev,
              cardPrimaryTextColor: val,
            })),
        },
        secondaryTextColor: {
          label: "Secondary Text Color",
          value: cardSecondaryTextColor,
          onChange: (val: string) =>
            setKpiCardCustomization((prev) => ({
              ...prev,
              cardSecondaryTextColor: val,
            })),
        },
        iconPrimaryColor: {
          label: "Icon Primary Color",
          value: cardIconPrimaryColor,
          onChange: (val: string) =>
            setKpiCardCustomization((prev) => ({
              ...prev,
              cardIconPrimaryColor: val,
            })),
        },
        iconSecondaryColor: {
          label: "Icon Secondary Color",
          value: cardIconSecondaryColor,
          onChange: (val: string) =>
            setKpiCardCustomization((prev) => ({
              ...prev,
              cardIconSecondaryColor: val,
            })),
        },
        iconTertiaryColor: {
          label: "Icon Tertiary Color",
          value: cardIconTertiaryColor,
          onChange: (val: string) =>
            setKpiCardCustomization((prev) => ({
              ...prev,
              cardIconTertiaryColor: val,
            })),
        },
        iconPrimaryBackgroundColor: {
          label: "Icon Primary Background",
          value: cardIconPrimaryBackgroundColor,
          onChange: (val: string) =>
            setKpiCardCustomization((prev) => ({
              ...prev,
              cardIconPrimaryBackgroundColor: val,
            })),
        },
        iconSecondaryBackgroundColor: {
          label: "Icon Secondary Background",
          value: cardIconSecondaryBackgroundColor,
          onChange: (val: string) =>
            setKpiCardCustomization((prev) => ({
              ...prev,
              cardIconSecondaryBackgroundColor: val,
            })),
        },
        iconTertiaryBackgroundColor: {
          label: "Icon Tertiary Background",
          value: cardIconTertiaryBackgroundColor,
          onChange: (val: string) =>
            setKpiCardCustomization((prev) => ({
              ...prev,
              cardIconTertiaryBackgroundColor: val,
            })),
        },
        loadingColor: {
          label: "KPI Loading Color",
          value: kpiLoadingColor,
          onChange: (val: string) =>
            setKpiCardCustomization((prev) => ({
              ...prev,
              kpiLoadingColor: val,
            })),
        },
      }}
    />
  )
}
