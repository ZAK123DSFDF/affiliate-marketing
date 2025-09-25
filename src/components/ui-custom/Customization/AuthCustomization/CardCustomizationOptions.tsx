"use client"

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch"
import { useAtom } from "jotai"
import { cardCustomizationAtom } from "@/store/AuthCustomizationAtom"

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

  return (
    <OptionWithSwitch
      triggerSize={triggerSize}
      dropdownSize={dropdownSize}
      properties={{
        shadow: {
          label: "Enable Card Shadow",
          enabled: cardShadow,
          onToggle: (val) =>
            setCardCustomization((prev) => ({
              ...prev,
              cardShadow: val,
            })),
          children: {
            shadowColor: {
              label: "Shadow Color",
              value: cardShadowColor,
              onChange: (val) =>
                setCardCustomization((prev) => ({
                  ...prev,
                  cardShadowColor: val,
                })),
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
              onChange: (val) =>
                setCardCustomization((prev) => ({
                  ...prev,
                  cardShadowThickness: val,
                })),
            },
          },
        },
        border: {
          label: "Enable Card Border",
          enabled: cardBorder,
          onToggle: (val) =>
            setCardCustomization((prev) => ({
              ...prev,
              cardBorder: val,
            })),
          children: {
            borderColor: {
              label: "Border Color",
              value: cardBorderColor,
              onChange: (val) =>
                setCardCustomization((prev) => ({
                  ...prev,
                  cardBorderColor: val,
                })),
            },
          },
        },
        backgroundColor: {
          label: "Card Background Color",
          value: cardBackgroundColor,
          onChange: (val) =>
            setCardCustomization((prev) => ({
              ...prev,
              cardBackgroundColor: val,
            })),
        },
      }}
    />
  )
}
