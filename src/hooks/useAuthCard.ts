import { useCardCustomizationOption } from "@/hooks/useAuthCustomization"
import { getShadowWithColor } from "@/util/GetShadowWithColor"
import { toValidShadowSize } from "@/util/ValidateShadowColor"

export function useAuthCard(affiliate: boolean) {
  const {
    cardShadow,
    cardShadowColor,
    cardBorder,
    cardBorderColor,
    cardBackgroundColor,
    cardShadowThickness,
  } = useCardCustomizationOption()
  return {
    backgroundColor: (affiliate && cardBackgroundColor) || undefined,
    boxShadow:
      affiliate && cardShadow
        ? getShadowWithColor(
            toValidShadowSize(cardShadowThickness),
            cardShadowColor
          )
        : undefined,
    border:
      affiliate && cardBorder
        ? `1px solid ${cardBorderColor || "transparent"}`
        : "none",
  }
}
