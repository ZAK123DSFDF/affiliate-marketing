import {
  useCardCustomizationOption,
  useInputCustomizationOption,
} from "@/hooks/useAuthCustomization";
import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch";
import React from "react";

export const InputCustomizationOptions = ({ size }: { size?: string }) => {
  const {
    inputPlaceholderTextColor,
    inputLabelColor,
    inputIconColor,
    inputTextColor,
    inputErrorTextColor,
    inputBorderColor,
    inputErrorBorderColor,
    inputBorderFocusColor,
    inputLabelErrorColor,
    setColor,
  } = useInputCustomizationOption();
  return (
    <OptionWithSwitch
      triggerSize={size}
      properties={{
        inputLabelColor: {
          label: "Input Label Color",
          value: inputLabelColor,
          onChange: (val) => setColor("inputLabelColor", val),
        },
        inputIconColor: {
          label: "Input Icon Color",
          value: inputIconColor,
          onChange: (val) => setColor("inputIconColor", val),
        },
        inputTextColor: {
          label: "Input Text Color",
          value: inputTextColor,
          onChange: (val) => setColor("inputTextColor", val),
        },
        inputErrorTextColor: {
          label: "Input Error Text Color",
          value: inputErrorTextColor,
          onChange: (val) => setColor("inputErrorTextColor", val),
        },
        inputBorderColor: {
          label: "Input Border Color",
          value: inputBorderColor,
          onChange: (val) => setColor("inputBorderColor", val),
        },
        inputPlaceholderTextColor: {
          label: "Input Placeholder Color",
          value: inputPlaceholderTextColor,
          onChange: (val) => setColor("inputPlaceholderTextColor", val),
        },
        inputErrorBorderColor: {
          label: "Input Error Border Color",
          value: inputErrorBorderColor,
          onChange: (val) => setColor("inputErrorBorderColor", val),
        },
        inputBorderFocusColor: {
          label: "Input Border Focus Color",
          value: inputBorderFocusColor,
          onChange: (val) => setColor("inputBorderFocusColor", val),
        },
        inputLabelErrorColor: {
          label: "Input Label Error Color",
          value: inputLabelErrorColor,
          onChange: (val) => setColor("inputLabelErrorColor", val),
        },
      }}
    />
  );
};
