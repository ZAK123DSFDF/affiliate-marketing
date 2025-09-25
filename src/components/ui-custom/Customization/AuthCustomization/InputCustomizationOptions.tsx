"use client"

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch"
import { useAtom } from "jotai"
import { inputCustomizationAtom } from "@/store/AuthCustomizationAtom"

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

  return (
    <OptionWithSwitch
      triggerSize={size}
      properties={{
        inputLabelColor: {
          label: "Input Label Color",
          value: inputLabelColor,
          onChange: (val: string) =>
            setInputCustomization((prev) => ({
              ...prev,
              inputLabelColor: val,
            })),
        },
        inputIconColor: {
          label: "Input Icon Color",
          value: inputIconColor,
          onChange: (val: string) =>
            setInputCustomization((prev) => ({
              ...prev,
              inputIconColor: val,
            })),
        },
        inputTextColor: {
          label: "Input Text Color",
          value: inputTextColor,
          onChange: (val: string) =>
            setInputCustomization((prev) => ({
              ...prev,
              inputTextColor: val,
            })),
        },
        inputErrorTextColor: {
          label: "Input Error Text Color",
          value: inputErrorTextColor,
          onChange: (val: string) =>
            setInputCustomization((prev) => ({
              ...prev,
              inputErrorTextColor: val,
            })),
        },
        inputBorderColor: {
          label: "Input Border Color",
          value: inputBorderColor,
          onChange: (val: string) =>
            setInputCustomization((prev) => ({
              ...prev,
              inputBorderColor: val,
            })),
        },
        inputPlaceholderTextColor: {
          label: "Input Placeholder Color",
          value: inputPlaceholderTextColor,
          onChange: (val: string) =>
            setInputCustomization((prev) => ({
              ...prev,
              inputPlaceholderTextColor: val,
            })),
        },
        inputErrorBorderColor: {
          label: "Input Error Border Color",
          value: inputErrorBorderColor,
          onChange: (val: string) =>
            setInputCustomization((prev) => ({
              ...prev,
              inputErrorBorderColor: val,
            })),
        },
        inputBorderFocusColor: {
          label: "Input Border Focus Color",
          value: inputBorderFocusColor,
          onChange: (val: string) =>
            setInputCustomization((prev) => ({
              ...prev,
              inputBorderFocusColor: val,
            })),
        },
        inputLabelErrorColor: {
          label: "Input Label Error Color",
          value: inputLabelErrorColor,
          onChange: (val: string) =>
            setInputCustomization((prev) => ({
              ...prev,
              inputLabelErrorColor: val,
            })),
        },
      }}
    />
  )
}
