"use client";

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch";
import React from "react";
import { usePieChartCustomizationOption } from "@/hooks/useDashboardCustomization";

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
    setPieChartColor,
  } = usePieChartCustomizationOption();

  return (
    <OptionWithSwitch
      triggerSize={triggerSize}
      dropdownSize={dropdownSize}
      properties={{
        pieColor1: {
          label: "Pie Color 1",
          value: pieColor1,
          onChange: (val) => setPieChartColor("pieColor1", val),
        },
        pieColor2: {
          label: "Pie Color 2",
          value: pieColor2,
          onChange: (val) => setPieChartColor("pieColor2", val),
        },
        pieColor3: {
          label: "Pie Color 3",
          value: pieColor3,
          onChange: (val) => setPieChartColor("pieColor3", val),
        },
        pieColor4: {
          label: "Pie Color 4",
          value: pieColor4,
          onChange: (val) => setPieChartColor("pieColor4", val),
        },
        pieColor5: {
          label: "Pie Color 5",
          value: pieColor5,
          onChange: (val) => setPieChartColor("pieColor5", val),
        },
        pieColor6: {
          label: "Pie Color 6",
          value: pieColor6,
          onChange: (val) => setPieChartColor("pieColor6", val),
        },
        pieColor7: {
          label: "Pie Color 7",
          value: pieColor7,
          onChange: (val) => setPieChartColor("pieColor7", val),
        },
        pieColor8: {
          label: "Pie Color 8",
          value: pieColor8,
          onChange: (val) => setPieChartColor("pieColor8", val),
        },
        pieFallbackColor: {
          label: "Pie Fallback Color",
          value: pieFallbackColor,
          onChange: (val) => setPieChartColor("pieFallbackColor", val),
        },
      }}
    />
  );
};
