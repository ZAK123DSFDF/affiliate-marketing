"use client";

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch";
import React from "react";
import { usePieChartCustomizationOption } from "@/hooks/useDashboardCustomization";
import { updateDashboardCustomization } from "@/customization/Dashboard/DashboardCustomizationChanges";

export const PieChartCustomizationOptions = ({
  triggerSize,
  dropdownSize,
}: {
  triggerSize?: string;
  dropdownSize?: string;
}) => {
  const {
    pieColor1,
    pieColor2,
    pieColor3,
    pieColor4,
    pieColor5,
    pieColor6,
    pieColor7,
    pieColor8,
    pieFallbackColor,
  } = usePieChartCustomizationOption();

  return (
    <OptionWithSwitch
      triggerSize={triggerSize}
      dropdownSize={dropdownSize}
      properties={{
        pieColor1: {
          label: "Pie Color 1",
          value: pieColor1,
          onChange: (val) =>
            updateDashboardCustomization(
              "usePieChartColorCustomization",
              "pieColor1",
              val,
            ),
        },
        pieColor2: {
          label: "Pie Color 2",
          value: pieColor2,
          onChange: (val) =>
            updateDashboardCustomization(
              "usePieChartColorCustomization",
              "pieColor2",
              val,
            ),
        },
        pieColor3: {
          label: "Pie Color 3",
          value: pieColor3,
          onChange: (val) =>
            updateDashboardCustomization(
              "usePieChartColorCustomization",
              "pieColor3",
              val,
            ),
        },
        pieColor4: {
          label: "Pie Color 4",
          value: pieColor4,
          onChange: (val) =>
            updateDashboardCustomization(
              "usePieChartColorCustomization",
              "pieColor4",
              val,
            ),
        },
        pieColor5: {
          label: "Pie Color 5",
          value: pieColor5,
          onChange: (val) =>
            updateDashboardCustomization(
              "usePieChartColorCustomization",
              "pieColor5",
              val,
            ),
        },
        pieColor6: {
          label: "Pie Color 6",
          value: pieColor6,
          onChange: (val) =>
            updateDashboardCustomization(
              "usePieChartColorCustomization",
              "pieColor6",
              val,
            ),
        },
        pieColor7: {
          label: "Pie Color 7",
          value: pieColor7,
          onChange: (val) =>
            updateDashboardCustomization(
              "usePieChartColorCustomization",
              "pieColor7",
              val,
            ),
        },
        pieColor8: {
          label: "Pie Color 8",
          value: pieColor8,
          onChange: (val) =>
            updateDashboardCustomization(
              "usePieChartColorCustomization",
              "pieColor8",
              val,
            ),
        },
        pieFallbackColor: {
          label: "Pie Fallback Color",
          value: pieFallbackColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "usePieChartColorCustomization",
              "pieFallbackColor",
              val,
            ),
        },
      }}
    />
  );
};
