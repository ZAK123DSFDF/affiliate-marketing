import { getShadowWithColor } from "@/util/GetShadowWithColor"
import { toValidShadowSize } from "@/util/ValidateShadowColor"
import { useDashboardCardCustomizationOption } from "@/hooks/useDashboardCustomization"

export function useDashboardCard(affiliate: boolean) {
  const dashboardCard = useDashboardCardCustomizationOption()
  return {
    backgroundColor:
      (affiliate && dashboardCard.dashboardCardBackgroundColor) || undefined,
    boxShadow:
      affiliate &&
      dashboardCard.dashboardCardShadow &&
      dashboardCard.dashboardCardShadow !== "none"
        ? affiliate &&
          getShadowWithColor(
            toValidShadowSize(dashboardCard.dashboardCardShadowThickness),
            dashboardCard.dashboardCardShadowColor
          )
        : "",
    border:
      affiliate && dashboardCard.dashboardCardBorder
        ? `1px solid ${affiliate && dashboardCard.dashboardCardBorderColor}`
        : "none",
  }
}
