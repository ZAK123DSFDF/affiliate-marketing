import { useCheckboxCustomizationOption } from "@/hooks/useAuthCustomization";
import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch";
import React from "react";
import { updateAuthCustomization } from "@/util/AuthCustomizationChanges";

export const CheckboxCustomizationOptions = ({ size }: { size?: string }) => {
  const { checkboxLabelColor, checkboxActiveColor, checkboxInactiveColor } =
    useCheckboxCustomizationOption();
  return (
    <OptionWithSwitch
      triggerSize={size}
      properties={{
        checkboxLabelColor: {
          label: "Checkbox Label Color",
          value: checkboxLabelColor,
          onChange: (val: string) =>
            updateAuthCustomization(
              "useCheckboxCustomization",
              "checkboxLabelColor",
              val,
            ),
        },
        checkboxActiveColor: {
          label: "Checkbox Active Color",
          value: checkboxActiveColor,
          onChange: (val: string) =>
            updateAuthCustomization(
              "useCheckboxCustomization",
              "checkboxActiveColor",
              val,
            ),
        },
        checkboxInactiveColor: {
          label: "Checkbox Inactive Color",
          value: checkboxInactiveColor,
          onChange: (val: string) =>
            updateAuthCustomization(
              "useCheckboxCustomization",
              "checkboxInactiveColor",
              val,
            ),
        },
      }}
    />
  );
};
