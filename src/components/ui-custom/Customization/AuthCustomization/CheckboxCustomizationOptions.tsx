import { useCheckboxCustomizationOption } from "@/hooks/useAuthCustomization";
import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch";
import React from "react";

export const CheckboxCustomizationOptions = ({ size }: { size?: string }) => {
  const {
    checkboxLabelColor,
    checkboxActiveColor,
    checkboxInactiveColor,
    setCheckboxColor,
  } = useCheckboxCustomizationOption();
  return (
    <OptionWithSwitch
      triggerSize={size}
      properties={{
        checkboxLabelColor: {
          label: "Checkbox Label Color",
          value: checkboxLabelColor,
          onChange: (val) => setCheckboxColor("checkboxLabelColor", val),
        },
        checkboxActiveColor: {
          label: "Checkbox Active Color",
          value: checkboxActiveColor,
          onChange: (val) => setCheckboxColor("checkboxActiveColor", val),
        },
        checkboxInactiveColor: {
          label: "Checkbox Inactive Color",
          value: checkboxInactiveColor,
          onChange: (val) => setCheckboxColor("checkboxInactiveColor", val),
        },
      }}
    />
  );
};
