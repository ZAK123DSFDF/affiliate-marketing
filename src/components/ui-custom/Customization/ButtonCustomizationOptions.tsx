"use client";

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch";
import { useButtonCustomizationOption } from "@/hooks/useCustomization";

export const ButtonCustomizationOptions = ({ size }: { size?: string }) => {
  const {
    buttonTextColor,
    buttonBackgroundColor,
    buttonDisabledTextColor,
    buttonDisabledBackgroundColor,
    setButtonColor,
  } = useButtonCustomizationOption();

  return (
    <OptionWithSwitch
      triggerSize={size}
      properties={{
        buttonTextColor: {
          label: "Button Text Color",
          value: buttonTextColor,
          onChange: (val) => setButtonColor("buttonTextColor", val),
        },
        buttonBackgroundColor: {
          label: "Button Background Color",
          value: buttonBackgroundColor,
          onChange: (val) => setButtonColor("buttonBackgroundColor", val),
        },
        buttonDisabledTextColor: {
          label: "Disabled Text Color",
          value: buttonDisabledTextColor,
          onChange: (val) => setButtonColor("buttonDisabledTextColor", val),
        },
        buttonDisabledBackgroundColor: {
          label: "Disabled Background Color",
          value: buttonDisabledBackgroundColor,
          onChange: (val) =>
            setButtonColor("buttonDisabledBackgroundColor", val),
        },
      }}
    />
  );
};
