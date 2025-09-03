"use client"

import { atom, PrimitiveAtom } from "jotai"

// Initial values — from your defaultDashboardCustomization
const defaultSidebarCustomization = {
  sideBarBackgroundColor: "",
  sideBarActiveNavigationTextColor: "",
  sideBarInActiveNavigationTextColor: "",
  sideBarActiveNavigationBackgroundColor: "",
  sideBarHoverNavigationBackgroundColor: "",
  sideBarHoverNavigationTextColor: "",
  sideBarProfileBackgroundColor: "",
  sideBarProfileTextPrimaryColor: "",
  sideBarProfileTextSecondaryColor: "",
  sideBarNavigationFocusRingColor: "",
}

type SidebarKeys = keyof typeof defaultSidebarCustomization

export const sidebarAtoms = (
  Object.keys(defaultSidebarCustomization) as SidebarKeys[]
).reduce(
  (acc, key) => {
    acc[key] = atom(defaultSidebarCustomization[key])
    return acc
  },
  {} as Record<SidebarKeys, PrimitiveAtom<string>>
)
