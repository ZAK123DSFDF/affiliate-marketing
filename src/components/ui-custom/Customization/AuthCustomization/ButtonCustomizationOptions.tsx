"use client"

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch"
import { updateAuthCustomization } from "@/customization/Auth/AuthCustomizationChanges"
import { useAtom } from "jotai"
import { buttonCustomizationAtom } from "@/store/AuthCustomizationAtom"

export const ButtonCustomizationOptions = ({
  size,
  onlyShowEnabled,
}: {
  size?: string
  onlyShowEnabled?: boolean
}) => {
  const [
    {
      buttonTextColor,
      buttonBackgroundColor,
      buttonDisabledBackgroundColor,
      buttonDisabledTextColor,
    },
    setButtonCustomization,
  ] = useAtom(buttonCustomizationAtom)
  const enabledProps = {
    buttonTextColor: {
      label: "Button Text Color",
      value: buttonTextColor,
      onChange: (val: string) =>
        setButtonCustomization((prev) => ({
          ...prev,
          buttonTextColor: val,
        })),
    },
    buttonBackgroundColor: {
      label: "Button Background Color",
      value: buttonBackgroundColor,
      onChange: (val: string) =>
        setButtonCustomization((prev) => ({
          ...prev,
          buttonBackgroundColor: val,
        })),
    },
  }

  // Extra props only if not filtering
  const disabledProps = {
    buttonDisabledTextColor: {
      label: "Disabled Text Color",
      value: buttonDisabledTextColor,
      onChange: (val: string) =>
        setButtonCustomization((prev) => ({
          ...prev,
          buttonDisabledTextColor: val,
        })),
    },
    buttonDisabledBackgroundColor: {
      label: "Disabled Background Color",
      value: buttonDisabledBackgroundColor,
      onChange: (val: string) =>
        setButtonCustomization((prev) => ({
          ...prev,
          buttonDisabledBackgroundColor: val,
        })),
    },
  }

  const properties = onlyShowEnabled
    ? enabledProps
    : { ...enabledProps, ...disabledProps }

  return <OptionWithSwitch triggerSize={size} properties={properties} />
}
