"use client"

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch"
import { useButtonCustomizationOption } from "@/hooks/useAuthCustomization"
import { updateAuthCustomization } from "@/customization/Auth/AuthCustomizationChanges"

export const ButtonCustomizationOptions = ({
  size,
  onlyShowEnabled,
}: {
  size?: string
  onlyShowEnabled?: boolean
}) => {
  const {
    buttonTextColor,
    buttonBackgroundColor,
    buttonDisabledTextColor,
    buttonDisabledBackgroundColor,
  } = useButtonCustomizationOption()
  // Base properties
  const enabledProps = {
    buttonTextColor: {
      label: "Button Text Color",
      value: buttonTextColor,
      onChange: (val: string) =>
        updateAuthCustomization(
          "useButtonCustomization",
          "buttonTextColor",
          val
        ),
    },
    buttonBackgroundColor: {
      label: "Button Background Color",
      value: buttonBackgroundColor,
      onChange: (val: string) =>
        updateAuthCustomization(
          "useButtonCustomization",
          "buttonBackgroundColor",
          val
        ),
    },
  }

  // Extra props only if not filtering
  const disabledProps = {
    buttonDisabledTextColor: {
      label: "Disabled Text Color",
      value: buttonDisabledTextColor,
      onChange: (val: string) =>
        updateAuthCustomization(
          "useButtonCustomization",
          "buttonDisabledTextColor",
          val
        ),
    },
    buttonDisabledBackgroundColor: {
      label: "Disabled Background Color",
      value: buttonDisabledBackgroundColor,
      onChange: (val: string) =>
        updateAuthCustomization(
          "useButtonCustomization",
          "buttonDisabledBackgroundColor",
          val
        ),
    },
  }

  const properties = onlyShowEnabled
    ? enabledProps
    : { ...enabledProps, ...disabledProps }

  return <OptionWithSwitch triggerSize={size} properties={properties} />
}
