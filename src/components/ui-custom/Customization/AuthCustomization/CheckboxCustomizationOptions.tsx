"use client"

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch"
import { useAtom } from "jotai"
import { checkboxCustomizationAtom } from "@/store/AuthCustomizationAtom"
import { useThrottledOptionsUpdater } from "@/hooks/useThrottledOptionsUpdater"

export const CheckboxCustomizationOptions = ({ size }: { size?: string }) => {
  const [
    { checkboxLabelColor, checkboxActiveColor, checkboxInactiveColor },
    setCheckboxCustomization,
  ] = useAtom(checkboxCustomizationAtom)
  const throttled = useThrottledOptionsUpdater(setCheckboxCustomization, 300)
  return (
    <OptionWithSwitch
      triggerSize={size}
      properties={{
        checkboxLabelColor: {
          label: "Checkbox Label Color",
          value: checkboxLabelColor,
          onChange: throttled.checkboxLabelColor,
        },
        checkboxActiveColor: {
          label: "Checkbox Active Color",
          value: checkboxActiveColor,
          onChange: throttled.checkboxActiveColor,
        },
        checkboxInactiveColor: {
          label: "Checkbox Inactive Color",
          value: checkboxInactiveColor,
          onChange: throttled.checkboxInactiveColor,
        },
      }}
    />
  )
}
