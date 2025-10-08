"use client"

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch"
import { useAtom } from "jotai"
import { dashboardButtonCustomizationAtom } from "@/store/DashboardCustomizationAtom"
import { useThrottledOptionsUpdater } from "@/hooks/useThrottledOptionsUpdater"

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
  const throttled = useThrottledOptionsUpdater(
    setDashboardButtonCustomization,
    300
  )
  // Enabled properties
  const enabledProps = {
    buttonBackgroundColor: {
      label: "Button Background Color",
      value: dashboardButtonBackgroundColor,
      onChange: throttled.dashboardButtonBackgroundColor,
    },
    buttonTextColor: {
      label: "Button Text Color",
      value: dashboardButtonTextColor,
      onChange: throttled.dashboardButtonTextColor,
    },
  }

  // Disabled properties
  const disabledProps = {
    buttonDisabledBackgroundColor: {
      label: "Disabled Background Color",
      value: dashboardButtonDisabledBackgroundColor,
      onChange: throttled.dashboardButtonDisabledBackgroundColor,
    },
    buttonDisabledTextColor: {
      label: "Disabled Text Color",
      value: dashboardButtonDisabledTextColor,
      onChange: throttled.dashboardButtonDisabledTextColor,
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
