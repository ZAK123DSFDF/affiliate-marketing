"use client";

import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { localDashboardCustomizationSettings } from "@/lib/types/dashboardCustomization";

interface Props {
  value: { year?: number };
  onChange: (year?: number) => void;
  disabled?: boolean;
  customization?: localDashboardCustomizationSettings;
}

export default function YearSelect({
  value,
  onChange,
  disabled,
  customization,
}: Props) {
  const now = new Date();
  const START_YEAR = 1990;
  const years = Array.from(
    { length: now.getUTCFullYear() - START_YEAR + 1 },
    (_, i) => now.getUTCFullYear() - i,
  );

  const selectCustomization = {
    triggerBackgroundColor: customization?.yearSelectBackgroundColor,
    triggerTextColor: customization?.yearSelectTextColor,
    triggerActiveBorderColor: customization?.yearSelectActiveBorderColor,
    dropdownBackgroundColor: customization?.yearSelectDropDownBackgroundColor,
    dropdownTextColor: customization?.yearSelectDropDownTextColor,
    dropdownActiveTextColor: customization?.yearSelectDropDownActiveTextColor,
    dropdownActiveBackgroundColor:
      customization?.yearSelectDropDownActiveBackgroundColor,
    dropdownIconColor: customization?.yearSelectDropDownIconColor,
    dropdownHoverBackgroundColor:
      customization?.yearSelectDropDownHoverBackgroundColor,
    dropdownHoverTextColor: customization?.yearSelectDropDownHoverTextColor,
  };
  const currentSelectedValue = value.year ? value.year.toString() : "all";
  return (
    <div className="flex gap-2">
      <Select
        value={currentSelectedValue}
        onValueChange={(yearVal) =>
          onChange(yearVal === "all" ? undefined : parseInt(yearVal))
        }
        disabled={disabled}
      >
        <SelectTrigger
          className="w-[100px]"
          aria-disabled={disabled}
          customization={selectCustomization}
        >
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent customization={selectCustomization}>
          <SelectItem
            value="all"
            customization={selectCustomization}
            selectedValue={currentSelectedValue}
          >
            All
          </SelectItem>
          {years.map((y) => (
            <SelectItem
              key={y}
              value={y.toString()}
              customization={selectCustomization}
              selectedValue={currentSelectedValue}
            >
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
