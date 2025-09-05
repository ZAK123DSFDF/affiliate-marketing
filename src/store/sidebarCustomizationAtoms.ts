"use client"

import { atom, PrimitiveAtom } from "jotai"
import { defaultDashboardCustomization } from "@/customization/Dashboard/defaultDashboardCustomization"

const defaultSidebarCustomization =
  defaultDashboardCustomization.useSidebarCustomization

type SidebarKeys = keyof typeof defaultSidebarCustomization

export const sidebarAtoms = (
  Object.keys(defaultSidebarCustomization) as SidebarKeys[]
).reduce(
  (acc, key) => {
    // Use the value from defaultDashboardCustomization instead of empty string
    acc[key] = atom(defaultSidebarCustomization[key])
    return acc
  },
  {} as Record<SidebarKeys, PrimitiveAtom<string>>
)
