"use client"

import { ResettableColorInput } from "@/components/ui-custom/ResettableColorInput"
import { useAtom } from "jotai"
import {
  ThemeCustomization,
  themeCustomizationAtom,
} from "@/store/AuthCustomizationAtom"
import { useThrottledUpdater } from "@/hooks/useThrottledUpdater"

type ThemeKeys = keyof ThemeCustomization

type Props = {
  name: ThemeKeys
  showLabel?: boolean
  buttonSize?: string
}

export const ThemeCustomizationOptions = ({
  name,
  showLabel = false,
  buttonSize = "w-8 h-8",
}: Props) => {
  const [theme, setTheme] = useAtom(themeCustomizationAtom)
  const throttled = useThrottledUpdater(setTheme, 300)
  const labelMap: Record<ThemeKeys, string> = {
    headerColor: "Header",
    backgroundColor: "Background",
    linkTextColor: "Link Text",
    tertiaryTextColor: "Tertiary Text",
    primaryCustomization: "Primary",
    secondaryCustomization: "Secondary",
    InvalidPrimaryCustomization: "Invalid Primary",
    InvalidSecondaryCustomization: "Invalid Secondary",
    emailVerifiedPrimaryColor: "Email Verified Primary",
    emailVerifiedSecondaryColor: "Email Verified Secondary",
    emailVerifiedIconColor: "Email Verified Icon",
    splashLoadingColor: "Splash Loading",
    splashLoadingTextColor: "Splash Loading Text",
    splashErrorIconColor: "Splash Error Icon",
    splashErrorTextColor: "Splash Error Text",
    checkEmailPrimaryColor: "Check Email Primary",
    checkEmailSecondaryColor: "Check Email Secondary",
    googleSeparatorColor: "Google Separator",
  }

  return (
    <ResettableColorInput
      label={labelMap[name]}
      value={theme[name]}
      onChange={throttled[name]}
      showLabel={showLabel}
      buttonSize={buttonSize}
    />
  )
}
