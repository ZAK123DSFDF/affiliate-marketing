"use client"

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch"
import { useAtom } from "jotai"
import { googleButtonCustomizationAtom } from "@/store/AuthCustomizationAtom"

export const GoogleButtonCustomizationOptions = ({
  size,
}: {
  size?: string
}) => {
  const [
    { googleButtonTextColor, googleButtonBackgroundColor, googleIconColor },
    setGoogleButtonCustomization,
  ] = useAtom(googleButtonCustomizationAtom)

  const properties = {
    googleButtonTextColor: {
      label: "Google Text Color",
      value: googleButtonTextColor,
      onChange: (val: string) =>
        setGoogleButtonCustomization((prev) => ({
          ...prev,
          googleButtonTextColor: val,
        })),
    },
    googleButtonBackgroundColor: {
      label: "Google Background Color",
      value: googleButtonBackgroundColor,
      onChange: (val: string) =>
        setGoogleButtonCustomization((prev) => ({
          ...prev,
          googleButtonBackgroundColor: val,
        })),
    },
    googleIconColor: {
      label: "Google Icon Color",
      value: googleIconColor,
      onChange: (val: string) =>
        setGoogleButtonCustomization((prev) => ({
          ...prev,
          googleIconColor: val,
        })),
    },
  }

  return <OptionWithSwitch triggerSize={size} properties={properties} />
}
