"use client";

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch";
import React from "react";
import { useDashboardButtonCustomizationOption } from "@/hooks/useDashboardCustomization";

export const DashboardButtonCustomizationOptions = ({
  triggerSize,
  dropdownSize,
}: {
  triggerSize?: string;
  dropdownSize?: string;
}) => {
  const {
    dashboardButtonBackgroundColor,
    dashboardButtonTextColor,
    dashboardButtonDisabledBackgroundColor,
    dashboardButtonDisabledTextColor,
    setDashboardButtonColor,
  } = useDashboardButtonCustomizationOption();

  return (
    <OptionWithSwitch
      triggerSize={triggerSize}
      dropdownSize={dropdownSize}
      properties={{
        buttonBackgroundColor: {
          label: "Button Background Color",
          value: dashboardButtonBackgroundColor,
          onChange: (val) =>
            setDashboardButtonColor("dashboardButtonBackgroundColor", val),
        },
        buttonTextColor: {
          label: "Button Text Color",
          value: dashboardButtonTextColor,
          onChange: (val) =>
            setDashboardButtonColor("dashboardButtonTextColor", val),
        },
        buttonDisabledBackgroundColor: {
          label: "Disabled Background Color",
          value: dashboardButtonDisabledBackgroundColor,
          onChange: (val) =>
            setDashboardButtonColor(
              "dashboardButtonDisabledBackgroundColor",
              val,
            ),
        },
        buttonDisabledTextColor: {
          label: "Disabled Text Color",
          value: dashboardButtonDisabledTextColor,
          onChange: (val) =>
            setDashboardButtonColor("dashboardButtonDisabledTextColor", val),
        },
      }}
    />
  );
};
