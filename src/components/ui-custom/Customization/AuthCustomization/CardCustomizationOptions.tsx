"use client"

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch"
import { useAtom } from "jotai"
import { cardCustomizationAtom } from "@/store/AuthCustomizationAtom"
import { useThrottledOptionsUpdater } from "@/hooks/useThrottledOptionsUpdater"

export const CardCustomizationOptions = ({
  triggerSize,
  dropdownSize,
}: {
  triggerSize?: string
  dropdownSize?: string
}) => {
  const [
    {
      cardShadow,
      cardShadowColor,
      cardBorder,
      cardBorderColor,
      cardBackgroundColor,
      cardShadowThickness,
    },
    setCardCustomization,
  ] = useAtom(cardCustomizationAtom)
  const throttled = useThrottledOptionsUpdater(setCardCustomization, 300)
  return (
    <OptionWithSwitch
      triggerSize={triggerSize}
      dropdownSize={dropdownSize}
      properties={{
        shadow: {
          label: "Enable Card Shadow",
          enabled: cardShadow,
          onToggle: throttled.cardShadow,
          children: {
            shadowColor: {
              label: "Shadow Color",
              value: cardShadowColor,
              onChange: throttled.cardShadowColor,
            },
            shadowThickness: {
              label: "Shadow Thickness",
              value: cardShadowThickness,
              options: [
                { label: "Small", value: "sm" },
                { label: "Medium", value: "md" },
                { label: "Large", value: "lg" },
                { label: "Extra Large", value: "xl" },
              ],
              onChange: throttled.cardShadowThickness,
            },
          },
        },
        border: {
          label: "Enable Card Border",
          enabled: cardBorder,
          onToggle: throttled.cardBorder,
          children: {
            borderColor: {
              label: "Border Color",
              value: cardBorderColor,
              onChange: throttled.cardBorderColor,
            },
          },
        },
        backgroundColor: {
          label: "Card Background Color",
          value: cardBackgroundColor,
          onChange: throttled.cardBackgroundColor,
        },
      }}
    />
  )
}
