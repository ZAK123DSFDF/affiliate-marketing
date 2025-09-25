"use client"

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch"
import { useAtom } from "jotai"
import { sidebarCustomizationAtom } from "@/store/DashboardCustomizationAtom"

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

  return (
    <OptionWithSwitch
      triggerSize={triggerSize}
      dropdownSize={dropdownSize}
      properties={{
        sideBarBackgroundColor: {
          label: "Sidebar Background",
          value: sideBarBackgroundColor,
          onChange: (val: string) =>
            setSidebarCustomization((prev) => ({
              ...prev,
              sideBarBackgroundColor: val,
            })),
        },
        sideBarActiveNavigationTextColor: {
          label: "Active Nav Text",
          value: sideBarActiveNavigationTextColor,
          onChange: (val: string) =>
            setSidebarCustomization((prev) => ({
              ...prev,
              sideBarActiveNavigationTextColor: val,
            })),
        },
        sideBarInActiveNavigationTextColor: {
          label: "Inactive Nav Text",
          value: sideBarInActiveNavigationTextColor,
          onChange: (val: string) =>
            setSidebarCustomization((prev) => ({
              ...prev,
              sideBarInActiveNavigationTextColor: val,
            })),
        },
        sideBarActiveNavigationBackgroundColor: {
          label: "Active Nav Background",
          value: sideBarActiveNavigationBackgroundColor,
          onChange: (val: string) =>
            setSidebarCustomization((prev) => ({
              ...prev,
              sideBarActiveNavigationBackgroundColor: val,
            })),
        },
        sideBarHoverNavigationBackgroundColor: {
          label: "Hover Nav Background",
          value: sideBarHoverNavigationBackgroundColor,
          onChange: (val: string) =>
            setSidebarCustomization((prev) => ({
              ...prev,
              sideBarHoverNavigationBackgroundColor: val,
            })),
        },
        sideBarHoverNavigationTextColor: {
          label: "Hover Nav Text",
          value: sideBarHoverNavigationTextColor,
          onChange: (val: string) =>
            setSidebarCustomization((prev) => ({
              ...prev,
              sideBarHoverNavigationTextColor: val,
            })),
        },
        sideBarProfileBackgroundColor: {
          label: "Profile Background",
          value: sideBarProfileBackgroundColor,
          onChange: (val: string) =>
            setSidebarCustomization((prev) => ({
              ...prev,
              sideBarProfileBackgroundColor: val,
            })),
        },
        sideBarProfileTextPrimaryColor: {
          label: "Profile Text Primary",
          value: sideBarProfileTextPrimaryColor,
          onChange: (val: string) =>
            setSidebarCustomization((prev) => ({
              ...prev,
              sideBarProfileTextPrimaryColor: val,
            })),
        },
        sideBarProfileTextSecondaryColor: {
          label: "Profile Text Secondary",
          value: sideBarProfileTextSecondaryColor,
          onChange: (val: string) =>
            setSidebarCustomization((prev) => ({
              ...prev,
              sideBarProfileTextSecondaryColor: val,
            })),
        },
        sideBarNavigationFocusRingColor: {
          label: "Focus Ring Color",
          value: sideBarNavigationFocusRingColor,
          onChange: (val: string) =>
            setSidebarCustomization((prev) => ({
              ...prev,
              sideBarNavigationFocusRingColor: val,
            })),
        },
      }}
    />
  )
}
