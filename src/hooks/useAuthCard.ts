import { getShadowWithColor } from "@/util/GetShadowWithColor"
import { toValidShadowSize } from "@/util/ValidateShadowColor"
import { useAtomValue } from "jotai"
import { cardCustomizationAtom } from "@/store/AuthCustomizationAtom"

export function useAuthCard(affiliate: boolean) {
  const {
    cardShadow,
    cardShadowColor,
    cardBorder,
    cardBorderColor,
    cardBackgroundColor,
    cardShadowThickness,
  } = useAtomValue(cardCustomizationAtom)
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
