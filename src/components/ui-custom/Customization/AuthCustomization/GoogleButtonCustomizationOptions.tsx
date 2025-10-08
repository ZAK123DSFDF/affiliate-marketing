"use client"

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch"
import { useAtom } from "jotai"
import { googleButtonCustomizationAtom } from "@/store/AuthCustomizationAtom"
import { useThrottledOptionsUpdater } from "@/hooks/useThrottledOptionsUpdater"

export const GoogleButtonCustomizationOptions = ({
  size,
}: {
  size?: string
}) => {
  const [
    { googleButtonTextColor, googleButtonBackgroundColor, googleIconColor },
    setGoogleButtonCustomization,
  ] = useAtom(googleButtonCustomizationAtom)
  const throttled = useThrottledOptionsUpdater(
    setGoogleButtonCustomization,
    300
  )
  const properties = {
    googleButtonTextColor: {
      label: "Google Text Color",
      value: googleButtonTextColor,
      onChange: throttled.googleButtonTextColor,
    },
    googleButtonBackgroundColor: {
      label: "Google Background Color",
      value: googleButtonBackgroundColor,
      onChange: throttled.googleButtonBackgroundColor,
    },
    googleIconColor: {
      label: "Google Icon Color",
      value: googleIconColor,
      onChange: throttled.googleIconColor,
    },
  }

  return <OptionWithSwitch triggerSize={size} properties={properties} />
}
