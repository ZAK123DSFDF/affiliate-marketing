"use client"

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch"
import { useAtom } from "jotai"
import { chartCustomizationAtom } from "@/store/DashboardCustomizationAtom"
import { useThrottledOptionsUpdater } from "@/hooks/useThrottledOptionsUpdater"

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
      chartLoadingColor,
    },
    setChartCustomization,
  ] = useAtom(chartCustomizationAtom)
  const throttled = useThrottledOptionsUpdater(setChartCustomization, 300)
  return (
    <OptionWithSwitch
      triggerSize={triggerSize}
      dropdownSize={dropdownSize}
      properties={{
        horizontalLineColor: {
          label: "Horizontal Line Color",
          value: chartHorizontalLineColor,
          onChange: throttled.chartHorizontalLineColor,
        },
        dateColor: {
          label: "Date Color",
          value: chartDateColor,
          onChange: throttled.chartDateColor,
        },
        primaryColor: {
          label: "Primary Chart Color",
          value: chartPrimaryColor,
          onChange: throttled.chartPrimaryColor,
        },
        secondaryColor: {
          label: "Secondary Chart Color",
          value: chartSecondaryColor,
          onChange: throttled.chartSecondaryColor,
        },
        tertiaryColor: {
          label: "Tertiary Chart Color",
          value: chartTertiaryColor,
          onChange: throttled.chartTertiaryColor,
        },
        legendTextColor: {
          label: "Legend Text Color",
          value: chartLegendTextColor,
          onChange: throttled.chartLegendTextColor,
        },
        toolTipChartDateColor: {
          label: "Tooltip Date Color",
          value: toolTipChartDateColor,
          onChange: throttled.toolTipChartDateColor,
        },
        toolTipBackgroundColor: {
          label: "Tooltip Background Color",
          value: toolTipBackgroundColor,
          onChange: throttled.toolTipBackgroundColor,
        },
        toolTipTextColor: {
          label: "Tooltip Text Color",
          value: toolTipTextColor,
          onChange: throttled.toolTipTextColor,
        },
        toolTipNumberColor: {
          label: "Tooltip Number Color",
          value: toolTipNumberColor,
          onChange: throttled.toolTipNumberColor,
        },
        loadingColor: {
          label: "Chart Loading Color",
          value: chartLoadingColor,
          onChange: throttled.chartLoadingColor,
        },
      }}
    />
  )
}
