"use client"

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch"
import { useAtom } from "jotai"
import { chartCustomizationAtom } from "@/store/DashboardCustomizationAtom"

export const ChartCustomizationOptions = ({
  triggerSize,
  dropdownSize,
}: {
  triggerSize?: string
  dropdownSize?: string
}) => {
  const [
    {
      chartHorizontalLineColor,
      chartDateColor,
      chartPrimaryColor,
      chartSecondaryColor,
      chartTertiaryColor,
      chartLegendTextColor,
      toolTipChartDateColor,
      toolTipBackgroundColor,
      toolTipTextColor,
      toolTipNumberColor,
    },
    setChartCustomization,
  ] = useAtom(chartCustomizationAtom)

  return (
    <OptionWithSwitch
      triggerSize={triggerSize}
      dropdownSize={dropdownSize}
      properties={{
        horizontalLineColor: {
          label: "Horizontal Line Color",
          value: chartHorizontalLineColor,
          onChange: (val: string) =>
            setChartCustomization((prev) => ({
              ...prev,
              chartHorizontalLineColor: val,
            })),
        },
        dateColor: {
          label: "Date Color",
          value: chartDateColor,
          onChange: (val: string) =>
            setChartCustomization((prev) => ({
              ...prev,
              chartDateColor: val,
            })),
        },
        primaryColor: {
          label: "Primary Chart Color",
          value: chartPrimaryColor,
          onChange: (val: string) =>
            setChartCustomization((prev) => ({
              ...prev,
              chartPrimaryColor: val,
            })),
        },
        secondaryColor: {
          label: "Secondary Chart Color",
          value: chartSecondaryColor,
          onChange: (val: string) =>
            setChartCustomization((prev) => ({
              ...prev,
              chartSecondaryColor: val,
            })),
        },
        tertiaryColor: {
          label: "Tertiary Chart Color",
          value: chartTertiaryColor,
          onChange: (val: string) =>
            setChartCustomization((prev) => ({
              ...prev,
              chartTertiaryColor: val,
            })),
        },
        legendTextColor: {
          label: "Legend Text Color",
          value: chartLegendTextColor,
          onChange: (val: string) =>
            setChartCustomization((prev) => ({
              ...prev,
              chartLegendTextColor: val,
            })),
        },
        toolTipChartDateColor: {
          label: "Tooltip Date Color",
          value: toolTipChartDateColor,
          onChange: (val: string) =>
            setChartCustomization((prev) => ({
              ...prev,
              toolTipChartDateColor: val,
            })),
        },
        toolTipBackgroundColor: {
          label: "Tooltip Background Color",
          value: toolTipBackgroundColor,
          onChange: (val: string) =>
            setChartCustomization((prev) => ({
              ...prev,
              toolTipBackgroundColor: val,
            })),
        },
        toolTipTextColor: {
          label: "Tooltip Text Color",
          value: toolTipTextColor,
          onChange: (val: string) =>
            setChartCustomization((prev) => ({
              ...prev,
              toolTipTextColor: val,
            })),
        },
        toolTipNumberColor: {
          label: "Tooltip Number Color",
          value: toolTipNumberColor,
          onChange: (val: string) =>
            setChartCustomization((prev) => ({
              ...prev,
              toolTipNumberColor: val,
            })),
        },
      }}
    />
  )
}
