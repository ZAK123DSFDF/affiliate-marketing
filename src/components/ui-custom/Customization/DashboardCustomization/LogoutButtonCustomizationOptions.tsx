"use client"

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch"
import { useAtom } from "jotai"
import { logoutButtonCustomizationAtom } from "@/store/DashboardCustomizationAtom"

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

  return (
    <OptionWithSwitch
      triggerSize={size}
      properties={{
        logoutButtonBackgroundColor: {
          label: "Logout Button Background Color",
          value: logoutButtonBackgroundColor,
          onChange: (val: string) =>
            setLogoutButtonCustomization((prev) => ({
              ...prev,
              logoutButtonBackgroundColor: val,
            })),
        },
        logoutButtonTextColor: {
          label: "Logout Button Text Color",
          value: logoutButtonTextColor,
          onChange: (val: string) =>
            setLogoutButtonCustomization((prev) => ({
              ...prev,
              logoutButtonTextColor: val,
            })),
        },
        logoutButtonDisabledBackgroundColor: {
          label: "Logout Button Disabled Background",
          value: logoutButtonDisabledBackgroundColor,
          onChange: (val: string) =>
            setLogoutButtonCustomization((prev) => ({
              ...prev,
              logoutButtonDisabledBackgroundColor: val,
            })),
        },
        logoutButtonDisabledTextColor: {
          label: "Logout Button Disabled Text",
          value: logoutButtonDisabledTextColor,
          onChange: (val: string) =>
            setLogoutButtonCustomization((prev) => ({
              ...prev,
              logoutButtonDisabledTextColor: val,
            })),
        },
      }}
    />
  )
}
