"use client"

import { ResettableColorInput } from "@/components/ui-custom/ResettableColorInput"
import { useDashboardThemeCustomizationOption } from "@/hooks/useDashboardCustomization"
import { updateDashboardCustomization } from "@/customization/Dashboard/DashboardCustomizationChanges"

// Valid keys for dashboard theme customization
type DashboardThemeKeys =
  | "mainBackgroundColor"
  | "dashboardHeaderNameColor"
  | "dashboardHeaderDescColor"
  | "separatorColor"
  | "cardHeaderPrimaryTextColor"
  | "cardHeaderSecondaryTextColor"
  | "cardHeaderDescriptionTextColor"
  | "dialogHeaderColor"

type Props = {
  name: DashboardThemeKeys
  showLabel?: boolean
  buttonSize?: string
}

export const DashboardThemeCustomizationOptions = ({
  name,
  showLabel = false,
  buttonSize = "w-8 h-8",
}: Props) => {
  const {
    mainBackgroundColor,
    dashboardHeaderNameColor,
    dashboardHeaderDescColor,
    separatorColor,
    cardHeaderPrimaryTextColor,
    cardHeaderSecondaryTextColor,
    cardHeaderDescriptionTextColor,
    dialogHeaderColor,
  } = useDashboardThemeCustomizationOption()

  const valueMap: Record<DashboardThemeKeys, string> = {
    mainBackgroundColor,
    dashboardHeaderNameColor,
    dashboardHeaderDescColor,
    separatorColor,
    cardHeaderPrimaryTextColor,
    cardHeaderSecondaryTextColor,
    cardHeaderDescriptionTextColor,
    dialogHeaderColor,
  }

  const labelMap: Record<DashboardThemeKeys, string> = {
    mainBackgroundColor: "Main Background",
    dashboardHeaderNameColor: "Header Name",
    dashboardHeaderDescColor: "Header Description",
    separatorColor: "Separator",
    cardHeaderPrimaryTextColor: "Card Header Primary Text",
    cardHeaderSecondaryTextColor: "Card Header Secondary Text",
    cardHeaderDescriptionTextColor: "Card Header Description Text",
    dialogHeaderColor: "Dialog Header",
  }

  return (
    <ResettableColorInput
      label={labelMap[name]}
      value={valueMap[name]}
      onChange={(val) =>
        updateDashboardCustomization(
          "useDashboardThemeCustomization",
          name,
          val
        )
      }
      showLabel={showLabel}
      buttonSize={buttonSize}
    />
  )
}
