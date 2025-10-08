"use client"

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch"
import { useAtom } from "jotai"
import { logoutButtonCustomizationAtom } from "@/store/DashboardCustomizationAtom"
import { useThrottledOptionsUpdater } from "@/hooks/useThrottledOptionsUpdater"

export const LogoutButtonCustomizationOptions = ({
  size = "w-6 h-6",
}: {
  size?: string
}) => {
  const [
    {
      logoutButtonBackgroundColor,
      logoutButtonTextColor,
      logoutButtonDisabledBackgroundColor,
      logoutButtonDisabledTextColor,
    },
    setLogoutButtonCustomization,
  ] = useAtom(logoutButtonCustomizationAtom)
  const throttled = useThrottledOptionsUpdater(
    setLogoutButtonCustomization,
    300
  )
  return (
    <OptionWithSwitch
      triggerSize={size}
      properties={{
        logoutButtonBackgroundColor: {
          label: "Logout Button Background Color",
          value: logoutButtonBackgroundColor,
          onChange: throttled.logoutButtonBackgroundColor,
        },
        logoutButtonTextColor: {
          label: "Logout Button Text Color",
          value: logoutButtonTextColor,
          onChange: throttled.logoutButtonTextColor,
        },
        logoutButtonDisabledBackgroundColor: {
          label: "Logout Button Disabled Background",
          value: logoutButtonDisabledBackgroundColor,
          onChange: throttled.logoutButtonDisabledBackgroundColor,
        },
        logoutButtonDisabledTextColor: {
          label: "Logout Button Disabled Text",
          value: logoutButtonDisabledTextColor,
          onChange: throttled.logoutButtonDisabledTextColor,
        },
      }}
    />
  )
}
