"use client"

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch"
import { useAtom } from "jotai"
import { buttonCustomizationAtom } from "@/store/AuthCustomizationAtom"
import { useThrottledOptionsUpdater } from "@/hooks/useThrottledOptionsUpdater"

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
  const throttled = useThrottledOptionsUpdater(setButtonCustomization, 300)
  const enabledProps = {
    buttonTextColor: {
      label: "Button Text Color",
      value: buttonTextColor,
      onChange: throttled.buttonTextColor,
    },
    buttonBackgroundColor: {
      label: "Button Background Color",
      value: buttonBackgroundColor,
      onChange: throttled.buttonBackgroundColor,
    },
  }

  // Extra props only if not filtering
  const disabledProps = {
    buttonDisabledTextColor: {
      label: "Disabled Text Color",
      value: buttonDisabledTextColor,
      onChange: throttled.buttonDisabledTextColor,
    },
    buttonDisabledBackgroundColor: {
      label: "Disabled Background Color",
      value: buttonDisabledBackgroundColor,
      onChange: throttled.buttonDisabledBackgroundColor,
    },
  }

  const properties = onlyShowEnabled
    ? enabledProps
    : { ...enabledProps, ...disabledProps }

  return <OptionWithSwitch triggerSize={size} properties={properties} />
}
