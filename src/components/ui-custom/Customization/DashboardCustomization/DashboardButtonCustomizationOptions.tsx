"use client"

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch"
import React from "react"
import { useDashboardButtonCustomizationOption } from "@/hooks/useDashboardCustomization"
import { updateDashboardCustomization } from "@/customization/Dashboard/DashboardCustomizationChanges"

export const DashboardButtonCustomizationOptions = ({
  triggerSize,
  dropdownSize,
}: {
  triggerSize?: string
  dropdownSize?: string
}) => {
  const {
    dashboardButtonBackgroundColor,
    dashboardButtonTextColor,
    dashboardButtonDisabledBackgroundColor,
    dashboardButtonDisabledTextColor,
  } = useDashboardButtonCustomizationOption()

  return (
    <OptionWithSwitch
      triggerSize={triggerSize}
      dropdownSize={dropdownSize}
      properties={{
        buttonBackgroundColor: {
          label: "Button Background Color",
          value: dashboardButtonBackgroundColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useDashboardButtonCustomization",
              "dashboardButtonBackgroundColor",
              val
            ),
        },
        buttonTextColor: {
          label: "Button Text Color",
          value: dashboardButtonTextColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useDashboardButtonCustomization",
              "dashboardButtonTextColor",
              val
            ),
        },
        buttonDisabledBackgroundColor: {
          label: "Disabled Background Color",
          value: dashboardButtonDisabledBackgroundColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useDashboardButtonCustomization",
              "dashboardButtonDisabledBackgroundColor",
              val
            ),
        },
        buttonDisabledTextColor: {
          label: "Disabled Text Color",
          value: dashboardButtonDisabledTextColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useDashboardButtonCustomization",
              "dashboardButtonDisabledTextColor",
              val
            ),
        },
      }}
    />
  )
}
