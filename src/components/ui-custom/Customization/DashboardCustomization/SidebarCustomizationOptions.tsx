"use client"

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch"
import { useAtom } from "jotai"
import { sidebarCustomizationAtom } from "@/store/DashboardCustomizationAtom"
import { useThrottledOptionsUpdater } from "@/hooks/useThrottledOptionsUpdater"

export const SidebarCustomizationOptions = ({
  triggerSize,
  dropdownSize,
}: {
  triggerSize?: string
  dropdownSize?: string
}) => {
  const [
    {
      sideBarBackgroundColor,
      sideBarActiveNavigationTextColor,
      sideBarInActiveNavigationTextColor,
      sideBarActiveNavigationBackgroundColor,
      sideBarHoverNavigationBackgroundColor,
      sideBarHoverNavigationTextColor,
      sideBarProfileBackgroundColor,
      sideBarProfileTextPrimaryColor,
      sideBarProfileTextSecondaryColor,
      sideBarNavigationFocusRingColor,
    },
    setSidebarCustomization,
  ] = useAtom(sidebarCustomizationAtom)
  const throttled = useThrottledOptionsUpdater(setSidebarCustomization, 300)
  return (
    <OptionWithSwitch
      triggerSize={triggerSize}
      dropdownSize={dropdownSize}
      properties={{
        sideBarBackgroundColor: {
          label: "Sidebar Background",
          value: sideBarBackgroundColor,
          onChange: throttled.sideBarBackgroundColor,
        },
        sideBarActiveNavigationTextColor: {
          label: "Active Nav Text",
          value: sideBarActiveNavigationTextColor,
          onChange: throttled.sideBarActiveNavigationTextColor,
        },
        sideBarInActiveNavigationTextColor: {
          label: "Inactive Nav Text",
          value: sideBarInActiveNavigationTextColor,
          onChange: throttled.sideBarInActiveNavigationTextColor,
        },
        sideBarActiveNavigationBackgroundColor: {
          label: "Active Nav Background",
          value: sideBarActiveNavigationBackgroundColor,
          onChange: throttled.sideBarActiveNavigationBackgroundColor,
        },
        sideBarHoverNavigationBackgroundColor: {
          label: "Hover Nav Background",
          value: sideBarHoverNavigationBackgroundColor,
          onChange: throttled.sideBarHoverNavigationBackgroundColor,
        },
        sideBarHoverNavigationTextColor: {
          label: "Hover Nav Text",
          value: sideBarHoverNavigationTextColor,
          onChange: throttled.sideBarHoverNavigationTextColor,
        },
        sideBarProfileBackgroundColor: {
          label: "Profile Background",
          value: sideBarProfileBackgroundColor,
          onChange: throttled.sideBarProfileBackgroundColor,
        },
        sideBarProfileTextPrimaryColor: {
          label: "Profile Text Primary",
          value: sideBarProfileTextPrimaryColor,
          onChange: throttled.sideBarProfileTextPrimaryColor,
        },
        sideBarProfileTextSecondaryColor: {
          label: "Profile Text Secondary",
          value: sideBarProfileTextSecondaryColor,
          onChange: throttled.sideBarProfileTextSecondaryColor,
        },
        sideBarNavigationFocusRingColor: {
          label: "Focus Ring Color",
          value: sideBarNavigationFocusRingColor,
          onChange: throttled.sideBarNavigationFocusRingColor,
        },
      }}
    />
  )
}
