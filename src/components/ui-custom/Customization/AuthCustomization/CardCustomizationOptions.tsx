import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch"
import React from "react"
import { useCardCustomizationOption } from "@/hooks/useAuthCustomization"
import { updateAuthCustomization } from "@/customization/Auth/AuthCustomizationChanges"

export const CardCustomizationOptions = ({
  triggerSize,
  dropdownSize,
}: {
  triggerSize?: string
  dropdownSize?: string
}) => {
  const {
    cardShadow,
    cardShadowColor,
    cardBorder,
    cardBorderColor,
    cardBackgroundColor,
    cardShadowThickness,
  } = useCardCustomizationOption()
  return (
    <OptionWithSwitch
      triggerSize={triggerSize}
      dropdownSize={dropdownSize}
      properties={{
        shadow: {
          label: "Enable Card Shadow",
          enabled: cardShadow,
          onToggle: (val) =>
            updateAuthCustomization("useCardCustomization", "cardShadow", val),
          children: {
            shadowColor: {
              label: "Shadow Color",
              value: cardShadowColor,
              onChange: (val) =>
                updateAuthCustomization(
                  "useCardCustomization",
                  "cardShadowColor",
                  val
                ),
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
                updateAuthCustomization(
                  "useCardCustomization",
                  "cardShadowThickness",
                  val
                ),
            },
          },
        },
        border: {
          label: "Enable Card Border",
          enabled: cardBorder,
          onToggle: (val) =>
            updateAuthCustomization("useCardCustomization", "cardBorder", val),
          children: {
            borderColor: {
              label: "Border Color",
              value: cardBorderColor,
              onChange: (val) =>
                updateAuthCustomization(
                  "useCardCustomization",
                  "cardBorderColor",
                  val
                ),
            },
          },
        },
        backgroundColor: {
          label: "Card Background Color",
          value: cardBackgroundColor,
          onChange: (val) =>
            updateAuthCustomization(
              "useCardCustomization",
              "cardBackgroundColor",
              val
            ),
        },
      }}
    />
  )
}
