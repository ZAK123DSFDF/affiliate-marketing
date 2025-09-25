"use client"

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch"
import { useAtom } from "jotai"
import { dashboardCardCustomizationAtom } from "@/store/DashboardCustomizationAtom"

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

  return (
    <OptionWithSwitch
      triggerSize={triggerSize}
      dropdownSize={dropdownSize}
      properties={{
        shadow: {
          label: "Enable Card Shadow",
          enabled: dashboardCardShadow,
          onToggle: (val: boolean) =>
            setDashboardCardCustomization((prev) => ({
              ...prev,
              dashboardCardShadow: val,
            })),
          children: {
            shadowColor: {
              label: "Shadow Color",
              value: dashboardCardShadowColor,
              onChange: (val: string) =>
                setDashboardCardCustomization((prev) => ({
                  ...prev,
                  dashboardCardShadowColor: val,
                })),
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
              onChange: (val: string) =>
                setDashboardCardCustomization((prev) => ({
                  ...prev,
                  dashboardCardShadowThickness: val,
                })),
            },
          },
        },
        border: {
          label: "Enable Card Border",
          enabled: dashboardCardBorder,
          onToggle: (val: boolean) =>
            setDashboardCardCustomization((prev) => ({
              ...prev,
              dashboardCardBorder: val,
            })),
          children: {
            borderColor: {
              label: "Border Color",
              value: dashboardCardBorderColor,
              onChange: (val: string) =>
                setDashboardCardCustomization((prev) => ({
                  ...prev,
                  dashboardCardBorderColor: val,
                })),
            },
          },
        },
        backgroundColor: {
          label: "Card Background Color",
          value: dashboardCardBackgroundColor,
          onChange: (val: string) =>
            setDashboardCardCustomization((prev) => ({
              ...prev,
              dashboardCardBackgroundColor: val,
            })),
        },
      }}
    />
  )
}
