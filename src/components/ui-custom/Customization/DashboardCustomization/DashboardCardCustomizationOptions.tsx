"use client"

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch"
import { useAtom } from "jotai"
import { dashboardCardCustomizationAtom } from "@/store/DashboardCustomizationAtom"
import { useThrottledOptionsUpdater } from "@/hooks/useThrottledOptionsUpdater"

export const DashboardCardCustomizationOptions = ({
  triggerSize,
  dropdownSize,
}: {
  triggerSize?: string
  dropdownSize?: string
}) => {
  const [
    {
      dashboardCardShadow,
      dashboardCardShadowColor,
      dashboardCardBorder,
      dashboardCardBorderColor,
      dashboardCardBackgroundColor,
      dashboardCardShadowThickness,
    },
    setDashboardCardCustomization,
  ] = useAtom(dashboardCardCustomizationAtom)
  const throttled = useThrottledOptionsUpdater(
    setDashboardCardCustomization,
    300
  )
  return (
    <OptionWithSwitch
      triggerSize={triggerSize}
      dropdownSize={dropdownSize}
      properties={{
        shadow: {
          label: "Enable Card Shadow",
          enabled: dashboardCardShadow,
          onToggle: throttled.dashboardCardShadow,
          children: {
            shadowColor: {
              label: "Shadow Color",
              value: dashboardCardShadowColor,
              onChange: throttled.dashboardCardShadowColor,
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
              onChange: throttled.dashboardCardShadowThickness,
            },
          },
        },
        border: {
          label: "Enable Card Border",
          enabled: dashboardCardBorder,
          onToggle: throttled.dashboardCardBorder,
          children: {
            borderColor: {
              label: "Border Color",
              value: dashboardCardBorderColor,
              onChange: throttled.dashboardCardBorderColor,
            },
          },
        },
        backgroundColor: {
          label: "Card Background Color",
          value: dashboardCardBackgroundColor,
          onChange: throttled.dashboardCardBackgroundColor,
        },
      }}
    />
  )
}
