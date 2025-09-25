"use client"

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch"
import { useAtom } from "jotai"
import { dashboardButtonCustomizationAtom } from "@/store/DashboardCustomizationAtom"

export const DashboardButtonCustomizationOptions = ({
  triggerSize,
  dropdownSize,
}: {
  triggerSize?: string
  dropdownSize?: string
}) => {
  const [
    {
      dashboardButtonBackgroundColor,
      dashboardButtonTextColor,
      dashboardButtonDisabledBackgroundColor,
      dashboardButtonDisabledTextColor,
    },
    setDashboardButtonCustomization,
  ] = useAtom(dashboardButtonCustomizationAtom)

  return (
    <OptionWithSwitch
      triggerSize={triggerSize}
      dropdownSize={dropdownSize}
      properties={{
        buttonBackgroundColor: {
          label: "Button Background Color",
          value: dashboardButtonBackgroundColor,
          onChange: (val: string) =>
            setDashboardButtonCustomization((prev) => ({
              ...prev,
              dashboardButtonBackgroundColor: val,
            })),
        },
        buttonTextColor: {
          label: "Button Text Color",
          value: dashboardButtonTextColor,
          onChange: (val: string) =>
            setDashboardButtonCustomization((prev) => ({
              ...prev,
              dashboardButtonTextColor: val,
            })),
        },
        buttonDisabledBackgroundColor: {
          label: "Disabled Background Color",
          value: dashboardButtonDisabledBackgroundColor,
          onChange: (val: string) =>
            setDashboardButtonCustomization((prev) => ({
              ...prev,
              dashboardButtonDisabledBackgroundColor: val,
            })),
        },
        buttonDisabledTextColor: {
          label: "Disabled Text Color",
          value: dashboardButtonDisabledTextColor,
          onChange: (val: string) =>
            setDashboardButtonCustomization((prev) => ({
              ...prev,
              dashboardButtonDisabledTextColor: val,
            })),
        },
      }}
    />
  )
}
