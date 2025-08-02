import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch";
import React from "react";
import { useCardCustomizationOption } from "@/hooks/useCustomization";

export const CardCustomizationOptions = ({ size }: { size?: string }) => {
  const {
    cardShadow,
    cardShadowColor,
    cardBorder,
    cardBorderColor,
    cardBackgroundColor,
    setCardSwitch,
    setCardColor,
  } = useCardCustomizationOption();
  return (
    <OptionWithSwitch
      triggerSize={size}
      properties={{
        shadow: {
          label: "Enable Card Shadow",
          enabled: cardShadow,
          onToggle: (val) => setCardSwitch("cardShadow", val),
          children: {
            shadowColor: {
              label: "Shadow Color",
              value: cardShadowColor,
              onChange: (val) => setCardColor("cardShadowColor", val),
            },
          },
        },
        border: {
          label: "Enable Card Border",
          enabled: cardBorder,
          onToggle: (val) => setCardSwitch("cardBorder", val),
          children: {
            borderColor: {
              label: "Border Color",
              value: cardBorderColor,
              onChange: (val) => setCardColor("cardBorderColor", val),
            },
          },
        },
        backgroundColor: {
          label: "Card Background Color",
          value: cardBackgroundColor,
          onChange: (val) => setCardColor("cardBackgroundColor", val),
        },
      }}
    />
  );
};
