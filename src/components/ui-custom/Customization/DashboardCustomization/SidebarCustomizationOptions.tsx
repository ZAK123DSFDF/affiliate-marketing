"use client"

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch"
import React from "react"
import { useSidebarCustomizationOptionJotai } from "@/hooks/useSidebarCustomizationOptionJotai"

export const SidebarCustomizationOptions = ({
  triggerSize,
  dropdownSize,
}: {
  triggerSize?: string
  dropdownSize?: string
}) => {
  const {
    sideBarBackgroundColor,
    setBackground,
    sideBarActiveNavigationTextColor,
    setActiveText,
    sideBarInActiveNavigationTextColor,
    setInactiveText,
    sideBarActiveNavigationBackgroundColor,
    setActiveBg,
    sideBarHoverNavigationBackgroundColor,
    setHoverBg,
    sideBarHoverNavigationTextColor,
    setHoverText,
    sideBarProfileBackgroundColor,
    setProfileBg,
    sideBarProfileTextPrimaryColor,
    setProfileTextPrimary,
    sideBarProfileTextSecondaryColor,
    setProfileTextSecondary,
    sideBarNavigationFocusRingColor,
    setFocusRing,
  } = useSidebarCustomizationOptionJotai()

  return (
    <OptionWithSwitch
      triggerSize={triggerSize}
      dropdownSize={dropdownSize}
      properties={{
        sideBarBackgroundColor: {
          label: "Sidebar Background",
          value: sideBarBackgroundColor,
          onChange: setBackground,
        },
        sideBarActiveNavigationTextColor: {
          label: "Active Nav Text",
          value: sideBarActiveNavigationTextColor,
          onChange: setActiveText,
        },
        sideBarInActiveNavigationTextColor: {
          label: "Inactive Nav Text",
          value: sideBarInActiveNavigationTextColor,
          onChange: setInactiveText,
        },
        sideBarActiveNavigationBackgroundColor: {
          label: "Active Nav Background",
          value: sideBarActiveNavigationBackgroundColor,
          onChange: setActiveBg,
        },
        sideBarHoverNavigationBackgroundColor: {
          label: "Hover Nav Background",
          value: sideBarHoverNavigationBackgroundColor,
          onChange: setHoverBg,
        },
        sideBarHoverNavigationTextColor: {
          label: "Hover Nav Text",
          value: sideBarHoverNavigationTextColor,
          onChange: setHoverText,
        },
        sideBarProfileBackgroundColor: {
          label: "Profile Background",
          value: sideBarProfileBackgroundColor,
          onChange: setProfileBg,
        },
        sideBarProfileTextPrimaryColor: {
          label: "Profile Text Primary",
          value: sideBarProfileTextPrimaryColor,
          onChange: setProfileTextPrimary,
        },
        sideBarProfileTextSecondaryColor: {
          label: "Profile Text Secondary",
          value: sideBarProfileTextSecondaryColor,
          onChange: setProfileTextSecondary,
        },
        sideBarNavigationFocusRingColor: {
          label: "Focus Ring Color",
          value: sideBarNavigationFocusRingColor,
          onChange: setFocusRing,
        },
      }}
    />
  )
}
