"use client"

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch"
import React from "react"
import { useSidebarCustomizationOption } from "@/hooks/useDashboardCustomization"
import { updateDashboardCustomization } from "@/customization/Dashboard/DashboardCustomizationChanges"

export const SidebarCustomizationOptions = ({
  triggerSize,
  dropdownSize,
}: {
  triggerSize?: string
  dropdownSize?: string
}) => {
  const {
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
  } = useSidebarCustomizationOption()

  return (
    <OptionWithSwitch
      triggerSize={triggerSize}
      dropdownSize={dropdownSize}
      properties={{
        sideBarBackgroundColor: {
          label: "Sidebar Background",
          value: sideBarBackgroundColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useSidebarCustomization",
              "sideBarBackgroundColor",
              val
            ),
        },
        sideBarActiveNavigationTextColor: {
          label: "Active Nav Text",
          value: sideBarActiveNavigationTextColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useSidebarCustomization",
              "sideBarActiveNavigationTextColor",
              val
            ),
        },
        sideBarInActiveNavigationTextColor: {
          label: "Inactive Nav Text",
          value: sideBarInActiveNavigationTextColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useSidebarCustomization",
              "sideBarInActiveNavigationTextColor",
              val
            ),
        },
        sideBarActiveNavigationBackgroundColor: {
          label: "Active Nav Background",
          value: sideBarActiveNavigationBackgroundColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useSidebarCustomization",
              "sideBarActiveNavigationBackgroundColor",
              val
            ),
        },
        sideBarHoverNavigationBackgroundColor: {
          label: "Hover Nav Background",
          value: sideBarHoverNavigationBackgroundColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useSidebarCustomization",
              "sideBarHoverNavigationBackgroundColor",
              val
            ),
        },
        sideBarHoverNavigationTextColor: {
          label: "Hover Nav Text",
          value: sideBarHoverNavigationTextColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useSidebarCustomization",
              "sideBarHoverNavigationTextColor",
              val
            ),
        },
        sideBarProfileBackgroundColor: {
          label: "Profile Background",
          value: sideBarProfileBackgroundColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useSidebarCustomization",
              "sideBarProfileBackgroundColor",
              val
            ),
        },
        sideBarProfileTextPrimaryColor: {
          label: "Profile Text Primary",
          value: sideBarProfileTextPrimaryColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useSidebarCustomization",
              "sideBarProfileTextPrimaryColor",
              val
            ),
        },
        sideBarProfileTextSecondaryColor: {
          label: "Profile Text Secondary",
          value: sideBarProfileTextSecondaryColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useSidebarCustomization",
              "sideBarProfileTextSecondaryColor",
              val
            ),
        },
        sideBarNavigationFocusRingColor: {
          label: "Focus Ring Color",
          value: sideBarNavigationFocusRingColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useSidebarCustomization",
              "sideBarNavigationFocusRingColor",
              val
            ),
        },
      }}
    />
  )
}
