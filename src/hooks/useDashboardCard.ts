import { getShadowWithColor } from "@/util/GetShadowWithColor"
import { toValidShadowSize } from "@/util/ValidateShadowColor"
import { useAtomValue } from "jotai"
import { dashboardCardCustomizationAtom } from "@/store/DashboardCustomizationAtom"

export function useDashboardCard(affiliate: boolean) {
  const {
    dashboardCardBackgroundColor,
    dashboardCardShadow,
    dashboardCardBorder,
    dashboardCardBorderColor,
    dashboardCardShadowThickness,
    dashboardCardShadowColor,
  } = useAtomValue(dashboardCardCustomizationAtom)
  return {
    backgroundColor: (affiliate && dashboardCardBackgroundColor) || undefined,
    boxShadow:
      affiliate && dashboardCardShadow
        ? getShadowWithColor(
            toValidShadowSize(dashboardCardShadowThickness),
            dashboardCardShadowColor
          )
        : "",
    border:
      affiliate && dashboardCardBorder
        ? `1px solid ${affiliate && dashboardCardBorderColor}`
        : "none",
  }
}
