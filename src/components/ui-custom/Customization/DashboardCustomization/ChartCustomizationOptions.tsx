"use client";

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch";
import React from "react";
import { useChartCustomizationOption } from "@/hooks/useDashboardCustomization";
import { updateDashboardCustomization } from "@/customization/Dashboard/DashboardCustomizationChanges";

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
            updateDashboardCustomization(
              "useChartCustomization",
              "chartHorizontalLineColor",
              val,
            ),
        },
        dateColor: {
          label: "Date Color",
          value: chartDateColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useChartCustomization",
              "chartDateColor",
              val,
            ),
        },
        primaryColor: {
          label: "Primary Chart Color",
          value: chartPrimaryColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useChartCustomization",
              "chartPrimaryColor",
              val,
            ),
        },
        secondaryColor: {
          label: "Secondary Chart Color",
          value: chartSecondaryColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useChartCustomization",
              "chartSecondaryColor",
              val,
            ),
        },
        tertiaryColor: {
          label: "Tertiary Chart Color",
          value: chartTertiaryColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useChartCustomization",
              "chartTertiaryColor",
              val,
            ),
        },
        fourthColor: {
          label: "Fourth Chart Color",
          value: chartFourthColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useChartCustomization",
              "chartFourthColor",
              val,
            ),
        },
        legendTextColor: {
          label: "Legend Text Color",
          value: chartLegendTextColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useChartCustomization",
              "chartLegendTextColor",
              val,
            ),
        },
        toolTipChartDateColor: {
          label: "Tooltip Date Color",
          value: toolTipChartDateColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useChartCustomization",
              "toolTipChartDateColor",
              val,
            ),
        },
        toolTipBackgroundColor: {
          label: "Tooltip Background Color",
          value: toolTipBackgroundColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useChartCustomization",
              "toolTipBackgroundColor",
              val,
            ),
        },
        toolTipTextColor: {
          label: "Tooltip Text Color",
          value: toolTipTextColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useChartCustomization",
              "toolTipTextColor",
              val,
            ),
        },
        toolTipNumberColor: {
          label: "Tooltip Number Color",
          value: toolTipNumberColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useChartCustomization",
              "toolTipNumberColor",
              val,
            ),
        },
      }}
    />
  );
};
