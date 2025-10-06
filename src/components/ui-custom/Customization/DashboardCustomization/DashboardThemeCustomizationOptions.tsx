"use client"

import { ResettableColorInput } from "@/components/ui-custom/ResettableColorInput"
import { useAtom } from "jotai"
import { dashboardThemeCustomizationAtom } from "@/store/DashboardCustomizationAtom"

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
  | "missingPaypalHeaderColor"
  | "missingPaypalDescriptionColor"

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
  // read & write the dashboard theme customization atom
  const [themeCustomization, setThemeCustomization] = useAtom(
    dashboardThemeCustomizationAtom
  )

  const labelMap: Record<DashboardThemeKeys, string> = {
    mainBackgroundColor: "Main Background",
    dashboardHeaderNameColor: "Header Name",
    dashboardHeaderDescColor: "Header Description",
    separatorColor: "Separator",
    cardHeaderPrimaryTextColor: "Card Header Primary Text",
    cardHeaderSecondaryTextColor: "Card Header Secondary Text",
    cardHeaderDescriptionTextColor: "Card Header Description Text",
    dialogHeaderColor: "Dialog Header",
    missingPaypalHeaderColor: "Missing PayPal Header",
    missingPaypalDescriptionColor: "Missing PayPal Description",
  }

  return (
    <ResettableColorInput
      label={labelMap[name]}
      value={themeCustomization[name]}
      onChange={(val) =>
        setThemeCustomization({
          ...themeCustomization,
          [name]: val,
        })
      }
      showLabel={showLabel}
      buttonSize={buttonSize}
    />
  )
}
