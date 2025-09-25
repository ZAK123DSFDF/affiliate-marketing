"use client"

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch"
import { useAtom } from "jotai"
import { yearSelectCustomizationAtom } from "@/store/DashboardCustomizationAtom"

export const YearSelectCustomizationOptions = ({
  triggerSize,
  dropdownSize,
}: {
  triggerSize?: string
  dropdownSize?: string
}) => {
  const [
    {
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
    },
    setYearSelectCustomization,
  ] = useAtom(yearSelectCustomizationAtom)

  return (
    <OptionWithSwitch
      triggerSize={triggerSize}
      dropdownSize={dropdownSize}
      properties={{
        yearSelectBackgroundColor: {
          label: "Year Select Background",
          value: yearSelectBackgroundColor,
          onChange: (val: string) =>
            setYearSelectCustomization((prev) => ({
              ...prev,
              yearSelectBackgroundColor: val,
            })),
        },
        yearSelectTextColor: {
          label: "Year Select Text",
          value: yearSelectTextColor,
          onChange: (val: string) =>
            setYearSelectCustomization((prev) => ({
              ...prev,
              yearSelectTextColor: val,
            })),
        },
        yearSelectActiveBorderColor: {
          label: "Active Border",
          value: yearSelectActiveBorderColor,
          onChange: (val: string) =>
            setYearSelectCustomization((prev) => ({
              ...prev,
              yearSelectActiveBorderColor: val,
            })),
        },
        yearSelectDropDownBackgroundColor: {
          label: "Dropdown Background",
          value: yearSelectDropDownBackgroundColor,
          onChange: (val: string) =>
            setYearSelectCustomization((prev) => ({
              ...prev,
              yearSelectDropDownBackgroundColor: val,
            })),
        },
        yearSelectDropDownTextColor: {
          label: "Dropdown Text",
          value: yearSelectDropDownTextColor,
          onChange: (val: string) =>
            setYearSelectCustomization((prev) => ({
              ...prev,
              yearSelectDropDownTextColor: val,
            })),
        },
        yearSelectDropDownActiveTextColor: {
          label: "Dropdown Active Text",
          value: yearSelectDropDownActiveTextColor,
          onChange: (val: string) =>
            setYearSelectCustomization((prev) => ({
              ...prev,
              yearSelectDropDownActiveTextColor: val,
            })),
        },
        yearSelectDropDownActiveBackgroundColor: {
          label: "Dropdown Active Background",
          value: yearSelectDropDownActiveBackgroundColor,
          onChange: (val: string) =>
            setYearSelectCustomization((prev) => ({
              ...prev,
              yearSelectDropDownActiveBackgroundColor: val,
            })),
        },
        yearSelectDropDownIconColor: {
          label: "Dropdown Icon",
          value: yearSelectDropDownIconColor,
          onChange: (val: string) =>
            setYearSelectCustomization((prev) => ({
              ...prev,
              yearSelectDropDownIconColor: val,
            })),
        },
        yearSelectDropDownHoverBackgroundColor: {
          label: "Dropdown Hover Background",
          value: yearSelectDropDownHoverBackgroundColor,
          onChange: (val: string) =>
            setYearSelectCustomization((prev) => ({
              ...prev,
              yearSelectDropDownHoverBackgroundColor: val,
            })),
        },
        yearSelectDropDownHoverTextColor: {
          label: "Dropdown Hover Text",
          value: yearSelectDropDownHoverTextColor,
          onChange: (val: string) =>
            setYearSelectCustomization((prev) => ({
              ...prev,
              yearSelectDropDownHoverTextColor: val,
            })),
        },
      }}
    />
  )
}
