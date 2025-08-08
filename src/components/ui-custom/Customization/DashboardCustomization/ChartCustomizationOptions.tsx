"use client";

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch";
import React from "react";
import { useChartCustomizationOption } from "@/hooks/useDashboardCustomization";

export const ChartCustomizationOptions = ({
  triggerSize,
  dropdownSize,
}: {
  triggerSize?: string;
  dropdownSize?: string;
}) => {
  const {
    chartHorizontalLineColor,
    chartDateColor,
    chartPrimaryColor,
    chartSecondaryColor,
    chartTertiaryColor,
    chartFourthColor,
    chartLegendTextColor,
    toolTipChartDateColor,
    toolTipBackgroundColor,
    toolTipTextColor,
    toolTipNumberColor,
    setChartThemeColor,
  } = useChartCustomizationOption();

  return (
    <OptionWithSwitch
      triggerSize={triggerSize}
      dropdownSize={dropdownSize}
      properties={{
        horizontalLineColor: {
          label: "Horizontal Line Color",
          value: chartHorizontalLineColor,
          onChange: (val) =>
            setChartThemeColor("chartHorizontalLineColor", val),
        },
        dateColor: {
          label: "Date Color",
          value: chartDateColor,
          onChange: (val) => setChartThemeColor("chartDateColor", val),
        },
        primaryColor: {
          label: "Primary Chart Color",
          value: chartPrimaryColor,
          onChange: (val) => setChartThemeColor("chartPrimaryColor", val),
        },
        secondaryColor: {
          label: "Secondary Chart Color",
          value: chartSecondaryColor,
          onChange: (val) => setChartThemeColor("chartSecondaryColor", val),
        },
        tertiaryColor: {
          label: "Tertiary Chart Color",
          value: chartTertiaryColor,
          onChange: (val) => setChartThemeColor("chartTertiaryColor", val),
        },
        fourthColor: {
          label: "Fourth Chart Color",
          value: chartFourthColor,
          onChange: (val) => setChartThemeColor("chartFourthColor", val),
        },
        legendTextColor: {
          label: "Legend Text Color",
          value: chartLegendTextColor,
          onChange: (val) => setChartThemeColor("chartLegendTextColor", val),
        },
        toolTipChartDateColor: {
          label: "Tooltip Date Color",
          value: toolTipChartDateColor,
          onChange: (val) => setChartThemeColor("toolTipChartDateColor", val),
        },
        toolTipBackgroundColor: {
          label: "Tooltip Background Color",
          value: toolTipBackgroundColor,
          onChange: (val) => setChartThemeColor("toolTipBackgroundColor", val),
        },
        toolTipTextColor: {
          label: "Tooltip Text Color",
          value: toolTipTextColor,
          onChange: (val) => setChartThemeColor("toolTipTextColor", val),
        },
        toolTipNumberColor: {
          label: "Tooltip Number Color",
          value: toolTipNumberColor,
          onChange: (val) => setChartThemeColor("toolTipNumberColor", val),
        },
      }}
    />
  );
};
