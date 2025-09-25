import { CardTitle } from "@/components/ui/card"
import { DashboardThemeCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/DashboardThemeCustomizationOptions"
import React from "react"
import { useAtomValue } from "jotai"
import { dashboardThemeCustomizationAtom } from "@/store/DashboardCustomizationAtom"
interface profileCardHeaderProps {
  affiliate: boolean
  isPreview?: boolean
}
export default function ProfileCardHeader({
  affiliate = false,
  isPreview = false,
}: profileCardHeaderProps) {
  const { cardHeaderPrimaryTextColor } = useAtomValue(
    dashboardThemeCustomizationAtom
  )
  return (
    <div className="flex flex-row gap-2 items-center">
      <CardTitle
        style={{
          color: (affiliate && cardHeaderPrimaryTextColor) || undefined,
        }}
      >
        Account Information
      </CardTitle>
      {isPreview && (
        <DashboardThemeCustomizationOptions
          name="cardHeaderPrimaryTextColor"
          buttonSize="w-4 h-4"
        />
      )}
    </div>
  )
}
