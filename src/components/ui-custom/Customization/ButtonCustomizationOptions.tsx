"use client";

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch";
import { useButtonCustomizationOption } from "@/hooks/useCustomization";

export const ButtonCustomizationOptions = ({
  size,
  onlyShowEnabled,
}: {
  size?: string;
  onlyShowEnabled?: boolean;
}) => {
  const {
    buttonTextColor,
    buttonBackgroundColor,
    buttonDisabledTextColor,
    buttonDisabledBackgroundColor,
    setButtonColor,
  } = useButtonCustomizationOption();
  // Base properties
  const enabledProps = {
    buttonTextColor: {
      label: "Button Text Color",
      value: buttonTextColor,
      onChange: (val: string) => setButtonColor("buttonTextColor", val),
    },
    buttonBackgroundColor: {
      label: "Button Background Color",
      value: buttonBackgroundColor,
      onChange: (val: string) => setButtonColor("buttonBackgroundColor", val),
    },
  };

  // Extra props only if not filtering
  const disabledProps = {
    buttonDisabledTextColor: {
      label: "Disabled Text Color",
      value: buttonDisabledTextColor,
      onChange: (val: string) => setButtonColor("buttonDisabledTextColor", val),
    },
    buttonDisabledBackgroundColor: {
      label: "Disabled Background Color",
      value: buttonDisabledBackgroundColor,
      onChange: (val: string) =>
        setButtonColor("buttonDisabledBackgroundColor", val),
    },
  };

  const properties = onlyShowEnabled
    ? enabledProps
    : { ...enabledProps, ...disabledProps };

  return <OptionWithSwitch triggerSize={size} properties={properties} />;
};
