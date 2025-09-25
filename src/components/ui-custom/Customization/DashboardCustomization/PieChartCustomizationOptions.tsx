"use client"

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch"
import { useAtom } from "jotai"
import { pieChartColorCustomizationAtom } from "@/store/DashboardCustomizationAtom"

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
    },
    setPieChartCustomization,
  ] = useAtom(pieChartColorCustomizationAtom)

  return (
    <OptionWithSwitch
      triggerSize={triggerSize}
      dropdownSize={dropdownSize}
      properties={{
        pieColor1: {
          label: "Pie Color 1",
          value: pieColor1,
          onChange: (val: string) =>
            setPieChartCustomization((prev) => ({ ...prev, pieColor1: val })),
        },
        pieColor2: {
          label: "Pie Color 2",
          value: pieColor2,
          onChange: (val: string) =>
            setPieChartCustomization((prev) => ({ ...prev, pieColor2: val })),
        },
        pieColor3: {
          label: "Pie Color 3",
          value: pieColor3,
          onChange: (val: string) =>
            setPieChartCustomization((prev) => ({ ...prev, pieColor3: val })),
        },
        pieColor4: {
          label: "Pie Color 4",
          value: pieColor4,
          onChange: (val: string) =>
            setPieChartCustomization((prev) => ({ ...prev, pieColor4: val })),
        },
        pieColor5: {
          label: "Pie Color 5",
          value: pieColor5,
          onChange: (val: string) =>
            setPieChartCustomization((prev) => ({ ...prev, pieColor5: val })),
        },
        pieColor6: {
          label: "Pie Color 6",
          value: pieColor6,
          onChange: (val: string) =>
            setPieChartCustomization((prev) => ({ ...prev, pieColor6: val })),
        },
        pieColor7: {
          label: "Pie Color 7",
          value: pieColor7,
          onChange: (val: string) =>
            setPieChartCustomization((prev) => ({ ...prev, pieColor7: val })),
        },
        pieColor8: {
          label: "Pie Color 8",
          value: pieColor8,
          onChange: (val: string) =>
            setPieChartCustomization((prev) => ({ ...prev, pieColor8: val })),
        },
        pieFallbackColor: {
          label: "Pie Fallback Color",
          value: pieFallbackColor,
          onChange: (val: string) =>
            setPieChartCustomization((prev) => ({
              ...prev,
              pieFallbackColor: val,
            })),
        },
      }}
    />
  )
}
