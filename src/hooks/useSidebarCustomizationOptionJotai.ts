"use client"

import { useAtom } from "jotai"
import { sidebarAtoms } from "@/store/sidebarCustomizationAtoms"

export const useSidebarCustomizationOptionJotai = () => {
  const [sideBarBackgroundColor, setBackground] = useAtom(
    sidebarAtoms.sideBarBackgroundColor
  )
  const [sideBarActiveNavigationTextColor, setActiveText] = useAtom(
    sidebarAtoms.sideBarActiveNavigationTextColor
  )
  const [sideBarInActiveNavigationTextColor, setInactiveText] = useAtom(
    sidebarAtoms.sideBarInActiveNavigationTextColor
  )
  const [sideBarActiveNavigationBackgroundColor, setActiveBg] = useAtom(
    sidebarAtoms.sideBarActiveNavigationBackgroundColor
  )
  const [sideBarHoverNavigationBackgroundColor, setHoverBg] = useAtom(
    sidebarAtoms.sideBarHoverNavigationBackgroundColor
  )
  const [sideBarHoverNavigationTextColor, setHoverText] = useAtom(
    sidebarAtoms.sideBarHoverNavigationTextColor
  )
  const [sideBarProfileBackgroundColor, setProfileBg] = useAtom(
    sidebarAtoms.sideBarProfileBackgroundColor
  )
  const [sideBarProfileTextPrimaryColor, setProfileTextPrimary] = useAtom(
    sidebarAtoms.sideBarProfileTextPrimaryColor
  )
  const [sideBarProfileTextSecondaryColor, setProfileTextSecondary] = useAtom(
    sidebarAtoms.sideBarProfileTextSecondaryColor
  )
  const [sideBarNavigationFocusRingColor, setFocusRing] = useAtom(
    sidebarAtoms.sideBarNavigationFocusRingColor
  )

  return {
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
  }
}
