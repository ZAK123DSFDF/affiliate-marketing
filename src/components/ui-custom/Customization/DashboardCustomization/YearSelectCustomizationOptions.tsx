"use client"

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch"
import React from "react"
import { useYearSelectCustomizationOption } from "@/hooks/useDashboardCustomization"
import { updateDashboardCustomization } from "@/customization/Dashboard/DashboardCustomizationChanges"

export const YearSelectCustomizationOptions = ({
  triggerSize,
  dropdownSize,
}: {
  triggerSize?: string
  dropdownSize?: string
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
  } = useYearSelectCustomizationOption()

  return (
    <OptionWithSwitch
      triggerSize={triggerSize}
      dropdownSize={dropdownSize}
      properties={{
        yearSelectBackgroundColor: {
          label: "Year Select Background",
          value: yearSelectBackgroundColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useYearSelectCustomization",
              "yearSelectBackgroundColor",
              val
            ),
        },
        yearSelectTextColor: {
          label: "Year Select Text",
          value: yearSelectTextColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useYearSelectCustomization",
              "yearSelectTextColor",
              val
            ),
        },
        yearSelectActiveBorderColor: {
          label: "Active Border",
          value: yearSelectActiveBorderColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useYearSelectCustomization",
              "yearSelectActiveBorderColor",
              val
            ),
        },
        yearSelectDropDownBackgroundColor: {
          label: "Dropdown Background",
          value: yearSelectDropDownBackgroundColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useYearSelectCustomization",
              "yearSelectDropDownBackgroundColor",
              val
            ),
        },
        yearSelectDropDownTextColor: {
          label: "Dropdown Text",
          value: yearSelectDropDownTextColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useYearSelectCustomization",
              "yearSelectDropDownTextColor",
              val
            ),
        },
        yearSelectDropDownActiveTextColor: {
          label: "Dropdown Active Text",
          value: yearSelectDropDownActiveTextColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useYearSelectCustomization",
              "yearSelectDropDownActiveTextColor",
              val
            ),
        },
        yearSelectDropDownActiveBackgroundColor: {
          label: "Dropdown Active Background",
          value: yearSelectDropDownActiveBackgroundColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useYearSelectCustomization",
              "yearSelectDropDownActiveBackgroundColor",
              val
            ),
        },
        yearSelectDropDownIconColor: {
          label: "Dropdown Icon",
          value: yearSelectDropDownIconColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useYearSelectCustomization",
              "yearSelectDropDownIconColor",
              val
            ),
        },
        yearSelectDropDownHoverBackgroundColor: {
          label: "Dropdown Hover Background",
          value: yearSelectDropDownHoverBackgroundColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useYearSelectCustomization",
              "yearSelectDropDownHoverBackgroundColor",
              val
            ),
        },
        yearSelectDropDownHoverTextColor: {
          label: "Dropdown Hover Text",
          value: yearSelectDropDownHoverTextColor,
          onChange: (val) =>
            updateDashboardCustomization(
              "useYearSelectCustomization",
              "yearSelectDropDownHoverTextColor",
              val
            ),
        },
      }}
    />
  )
}
