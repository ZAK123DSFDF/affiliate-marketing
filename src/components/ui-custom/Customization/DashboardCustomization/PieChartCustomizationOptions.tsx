"use client"

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch"
import { useAtom } from "jotai"
import { pieChartColorCustomizationAtom } from "@/store/DashboardCustomizationAtom"
import { useThrottledOptionsUpdater } from "@/hooks/useThrottledOptionsUpdater"

export const PieChartCustomizationOptions = ({
  triggerSize,
  dropdownSize,
}: {
  triggerSize?: string
  dropdownSize?: string
}) => {
  const [
    {
      pieColor1,
      pieColor2,
      pieColor3,
      pieColor4,
      pieColor5,
      pieColor6,
      pieColor7,
      pieColor8,
      pieFallbackColor,
      pieChartLoadingColor,
      pieChartEmptyTextColor,
      pieChartErrorColor,
    },
    setPieChartCustomization,
  ] = useAtom(pieChartColorCustomizationAtom)
  const throttled = useThrottledOptionsUpdater(setPieChartCustomization, 300)
  return (
    <OptionWithSwitch
      triggerSize={triggerSize}
      dropdownSize={dropdownSize}
      properties={{
        pieColor1: {
          label: "Pie Color 1",
          value: pieColor1,
          onChange: throttled.pieColor1,
        },
        pieColor2: {
          label: "Pie Color 2",
          value: pieColor2,
          onChange: throttled.pieColor2,
        },
        pieColor3: {
          label: "Pie Color 3",
          value: pieColor3,
          onChange: throttled.pieColor3,
        },
        pieColor4: {
          label: "Pie Color 4",
          value: pieColor4,
          onChange: throttled.pieColor4,
        },
        pieColor5: {
          label: "Pie Color 5",
          value: pieColor5,
          onChange: throttled.pieColor5,
        },
        pieColor6: {
          label: "Pie Color 6",
          value: pieColor6,
          onChange: throttled.pieColor6,
        },
        pieColor7: {
          label: "Pie Color 7",
          value: pieColor7,
          onChange: throttled.pieColor7,
        },
        pieColor8: {
          label: "Pie Color 8",
          value: pieColor8,
          onChange: throttled.pieColor8,
        },
        pieFallbackColor: {
          label: "Pie Fallback Color",
          value: pieFallbackColor,
          onChange: throttled.pieFallbackColor,
        },
        loadingColor: {
          label: "Pie Chart Loading Color",
          value: pieChartLoadingColor,
          onChange: throttled.pieChartLoadingColor,
        },
        emptyTextColor: {
          label: "Pie Chart Empty Text Color",
          value: pieChartEmptyTextColor,
          onChange: throttled.pieChartEmptyTextColor,
        },
        errorColor: {
          label: "Pie Chart Error Color",
          value: pieChartErrorColor,
          onChange: throttled.pieChartErrorColor,
        },
      }}
    />
  )
}
