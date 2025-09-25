"use client"

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch"
import { useAtom } from "jotai"
import { checkboxCustomizationAtom } from "@/store/AuthCustomizationAtom"

export const CheckboxCustomizationOptions = ({ size }: { size?: string }) => {
  const [
    { checkboxLabelColor, checkboxActiveColor, checkboxInactiveColor },
    setCheckboxCustomization,
  ] = useAtom(checkboxCustomizationAtom)

  return (
    <OptionWithSwitch
      triggerSize={size}
      properties={{
        checkboxLabelColor: {
          label: "Checkbox Label Color",
          value: checkboxLabelColor,
          onChange: (val: string) =>
            setCheckboxCustomization((prev) => ({
              ...prev,
              checkboxLabelColor: val,
            })),
        },
        checkboxActiveColor: {
          label: "Checkbox Active Color",
          value: checkboxActiveColor,
          onChange: (val: string) =>
            setCheckboxCustomization((prev) => ({
              ...prev,
              checkboxActiveColor: val,
            })),
        },
        checkboxInactiveColor: {
          label: "Checkbox Inactive Color",
          value: checkboxInactiveColor,
          onChange: (val: string) =>
            setCheckboxCustomization((prev) => ({
              ...prev,
              checkboxInactiveColor: val,
            })),
        },
      }}
    />
  )
}
