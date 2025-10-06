"use client"

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch"
import { useAtom } from "jotai"
import { dashboardButtonCustomizationAtom } from "@/store/DashboardCustomizationAtom"

export const DashboardButtonCustomizationOptions = ({
  triggerSize,
  dropdownSize,
  onlyShowEnabled = false,
}: {
  triggerSize?: string
  dropdownSize?: string
  onlyShowEnabled?: boolean
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

  // Enabled properties
  const enabledProps = {
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
  }

  // Disabled properties
  const disabledProps = {
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
  }

  const properties = onlyShowEnabled
    ? enabledProps
    : { ...enabledProps, ...disabledProps }

  return (
    <OptionWithSwitch
      triggerSize={triggerSize}
      dropdownSize={dropdownSize}
      properties={properties}
    />
  )
}
