import {
  useCardCustomizationOption,
  useInputCustomizationOption,
} from "@/hooks/useCustomization";
import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch";
import React from "react";

export const InputCustomizationOptions = ({ size }: { size?: string }) => {
  const {
    inputLabelColor,
    inputLabelErrorColor,
    inputIconColor,
    inputTextColor,
    inputErrorTextColor,
    inputBorderColor,
    inputErrorBorderColor,
    inputPlaceholderTextColor,
    setInputColor,
  } = useInputCustomizationOption();
  return (
    <OptionWithSwitch
      triggerSize={size}
      properties={{
        inputLabelColor: {
          label: "Input Label Color",
          value: inputLabelColor,
          onChange: (val) => setInputColor("inputLabelColor", val),
        },
        inputLabelErrorColor: {
          label: "Input Label Error Color",
          value: inputLabelErrorColor,
          onChange: (val) => setInputColor("inputLabelErrorColor", val),
        },
        inputIconColor: {
          label: "Input Icon Color",
          value: inputIconColor,
          onChange: (val) => setInputColor("inputIconColor", val),
        },
        inputTextColor: {
          label: "Input Text Color",
          value: inputTextColor,
          onChange: (val) => setInputColor("inputTextColor", val),
        },
        inputErrorTextColor: {
          label: "Input Error Text Color",
          value: inputErrorTextColor,
          onChange: (val) => setInputColor("inputErrorTextColor", val),
        },
        inputBorderColor: {
          label: "Input Border Color",
          value: inputBorderColor,
          onChange: (val) => setInputColor("inputBorderColor", val),
        },
        inputErrorBorderColor: {
          label: "Input Error Border Color",
          value: inputErrorBorderColor,
          onChange: (val) => setInputColor("inputErrorBorderColor", val),
        },
        inputPlaceholderTextColor: {
          label: "Input Placeholder Color",
          value: inputPlaceholderTextColor,
          onChange: (val) => setInputColor("inputPlaceholderTextColor", val),
        },
      }}
    />
  );
};
