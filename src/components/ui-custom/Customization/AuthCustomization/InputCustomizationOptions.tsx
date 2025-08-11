import {
  useCardCustomizationOption,
  useInputCustomizationOption,
} from "@/hooks/useAuthCustomization";
import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch";
import React from "react";
import { updateAuthCustomization } from "@/customization/Auth/AuthCustomizationChanges";

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
  } = useInputCustomizationOption();
  return (
    <OptionWithSwitch
      triggerSize={size}
      properties={{
        inputLabelColor: {
          label: "Input Label Color",
          value: inputLabelColor,
          onChange: (val) =>
            updateAuthCustomization(
              "useInputCustomization",
              "inputLabelColor",
              val,
            ),
        },
        inputIconColor: {
          label: "Input Icon Color",
          value: inputIconColor,
          onChange: (val) =>
            updateAuthCustomization(
              "useInputCustomization",
              "inputIconColor",
              val,
            ),
        },
        inputTextColor: {
          label: "Input Text Color",
          value: inputTextColor,
          onChange: (val) =>
            updateAuthCustomization(
              "useInputCustomization",
              "inputTextColor",
              val,
            ),
        },
        inputErrorTextColor: {
          label: "Input Error Text Color",
          value: inputErrorTextColor,
          onChange: (val) =>
            updateAuthCustomization(
              "useInputCustomization",
              "inputErrorTextColor",
              val,
            ),
        },
        inputBorderColor: {
          label: "Input Border Color",
          value: inputBorderColor,
          onChange: (val) =>
            updateAuthCustomization(
              "useInputCustomization",
              "inputBorderColor",
              val,
            ),
        },
        inputPlaceholderTextColor: {
          label: "Input Placeholder Color",
          value: inputPlaceholderTextColor,
          onChange: (val) =>
            updateAuthCustomization(
              "useInputCustomization",
              "inputPlaceholderTextColor",
              val,
            ),
        },
        inputErrorBorderColor: {
          label: "Input Error Border Color",
          value: inputErrorBorderColor,
          onChange: (val) =>
            updateAuthCustomization(
              "useInputCustomization",
              "inputErrorBorderColor",
              val,
            ),
        },
        inputBorderFocusColor: {
          label: "Input Border Focus Color",
          value: inputBorderFocusColor,
          onChange: (val) =>
            updateAuthCustomization(
              "useInputCustomization",
              "inputBorderFocusColor",
              val,
            ),
        },
        inputLabelErrorColor: {
          label: "Input Label Error Color",
          value: inputLabelErrorColor,
          onChange: (val) =>
            updateAuthCustomization(
              "useInputCustomization",
              "inputLabelErrorColor",
              val,
            ),
        },
      }}
    />
  );
};
