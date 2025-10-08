"use client"

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch"
import { useAtom } from "jotai"
import { inputCustomizationAtom } from "@/store/AuthCustomizationAtom"
import { useThrottledOptionsUpdater } from "@/hooks/useThrottledOptionsUpdater"

export const InputCustomizationOptions = ({ size }: { size?: string }) => {
  const [
    {
      inputPlaceholderTextColor,
      inputLabelColor,
      inputIconColor,
      inputTextColor,
      inputErrorTextColor,
      inputBorderColor,
      inputErrorBorderColor,
      inputBorderFocusColor,
      inputLabelErrorColor,
    },
    setInputCustomization,
  ] = useAtom(inputCustomizationAtom)
  const throttled = useThrottledOptionsUpdater(setInputCustomization, 300)
  return (
    <OptionWithSwitch
      triggerSize={size}
      properties={{
        inputLabelColor: {
          label: "Input Label Color",
          value: inputLabelColor,
          onChange: throttled.inputLabelColor,
        },
        inputIconColor: {
          label: "Input Icon Color",
          value: inputIconColor,
          onChange: throttled.inputIconColor,
        },
        inputTextColor: {
          label: "Input Text Color",
          value: inputTextColor,
          onChange: throttled.inputTextColor,
        },
        inputErrorTextColor: {
          label: "Input Error Text Color",
          value: inputErrorTextColor,
          onChange: throttled.inputErrorTextColor,
        },
        inputBorderColor: {
          label: "Input Border Color",
          value: inputBorderColor,
          onChange: throttled.inputBorderColor,
        },
        inputPlaceholderTextColor: {
          label: "Input Placeholder Color",
          value: inputPlaceholderTextColor,
          onChange: throttled.inputPlaceholderTextColor,
        },
        inputErrorBorderColor: {
          label: "Input Error Border Color",
          value: inputErrorBorderColor,
          onChange: throttled.inputErrorBorderColor,
        },
        inputBorderFocusColor: {
          label: "Input Border Focus Color",
          value: inputBorderFocusColor,
          onChange: throttled.inputBorderFocusColor,
        },
        inputLabelErrorColor: {
          label: "Input Label Error Color",
          value: inputLabelErrorColor,
          onChange: throttled.inputLabelErrorColor,
        },
      }}
    />
  )
}
