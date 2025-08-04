"use client";

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch";
import React from "react";
import { useYearSelectCustomizationOption } from "@/hooks/useDashboardCustomization";

export const YearSelectCustomizationOptions = ({
  triggerSize,
  dropdownSize,
}: {
  triggerSize?: string;
  dropdownSize?: string;
}) => {
  const {
    yearSelectBackgroundColor,
    yearSelectTextColor,
    yearSelectActiveBorderColor,
    yearSelectDropDownBackgroundColor,
    yearSelectDropDownTextColor,
    yearSelectDropDownActiveTextColor,
    yearSelectDropDownActiveBackgroundColor,
    yearSelectDropDownIconColor,
    yearSelectDropDownHoverBackgroundColor,
    yearSelectDropDownHoverTextColor,
    setYearSelectColor,
  } = useYearSelectCustomizationOption();

  return (
    <OptionWithSwitch
      triggerSize={triggerSize}
      dropdownSize={dropdownSize}
      properties={{
        yearSelectBackgroundColor: {
          label: "Year Select Background",
          value: yearSelectBackgroundColor,
          onChange: (val) =>
            setYearSelectColor("yearSelectBackgroundColor", val),
        },
        yearSelectTextColor: {
          label: "Year Select Text",
          value: yearSelectTextColor,
          onChange: (val) => setYearSelectColor("yearSelectTextColor", val),
        },
        yearSelectActiveBorderColor: {
          label: "Active Border",
          value: yearSelectActiveBorderColor,
          onChange: (val) =>
            setYearSelectColor("yearSelectActiveBorderColor", val),
        },
        yearSelectDropDownBackgroundColor: {
          label: "Dropdown Background",
          value: yearSelectDropDownBackgroundColor,
          onChange: (val) =>
            setYearSelectColor("yearSelectDropDownBackgroundColor", val),
        },
        yearSelectDropDownTextColor: {
          label: "Dropdown Text",
          value: yearSelectDropDownTextColor,
          onChange: (val) =>
            setYearSelectColor("yearSelectDropDownTextColor", val),
        },
        yearSelectDropDownActiveTextColor: {
          label: "Dropdown Active Text",
          value: yearSelectDropDownActiveTextColor,
          onChange: (val) =>
            setYearSelectColor("yearSelectDropDownActiveTextColor", val),
        },
        yearSelectDropDownActiveBackgroundColor: {
          label: "Dropdown Active Background",
          value: yearSelectDropDownActiveBackgroundColor,
          onChange: (val) =>
            setYearSelectColor("yearSelectDropDownActiveBackgroundColor", val),
        },
        yearSelectDropDownIconColor: {
          label: "Dropdown Icon",
          value: yearSelectDropDownIconColor,
          onChange: (val) =>
            setYearSelectColor("yearSelectDropDownIconColor", val),
        },
        yearSelectDropDownHoverBackgroundColor: {
          label: "Dropdown Hover Background",
          value: yearSelectDropDownHoverBackgroundColor,
          onChange: (val) =>
            setYearSelectColor("yearSelectDropDownHoverBackgroundColor", val),
        },
        yearSelectDropDownHoverTextColor: {
          label: "Dropdown Hover Text",
          value: yearSelectDropDownHoverTextColor,
          onChange: (val) =>
            setYearSelectColor("yearSelectDropDownHoverTextColor", val),
        },
      }}
    />
  );
};
