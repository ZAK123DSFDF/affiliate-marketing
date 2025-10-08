"use client"

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch"
import { useAtom } from "jotai"
import { yearSelectCustomizationAtom } from "@/store/DashboardCustomizationAtom"
import { useThrottledOptionsUpdater } from "@/hooks/useThrottledOptionsUpdater"

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
  const throttled = useThrottledOptionsUpdater(setYearSelectCustomization, 300)
  return (
    <OptionWithSwitch
      triggerSize={triggerSize}
      dropdownSize={dropdownSize}
      properties={{
        yearSelectBackgroundColor: {
          label: "Year Select Background",
          value: yearSelectBackgroundColor,
          onChange: throttled.yearSelectBackgroundColor,
        },
        yearSelectTextColor: {
          label: "Year Select Text",
          value: yearSelectTextColor,
          onChange: throttled.yearSelectTextColor,
        },
        yearSelectActiveBorderColor: {
          label: "Active Border",
          value: yearSelectActiveBorderColor,
          onChange: throttled.yearSelectActiveBorderColor,
        },
        yearSelectDropDownBackgroundColor: {
          label: "Dropdown Background",
          value: yearSelectDropDownBackgroundColor,
          onChange: throttled.yearSelectDropDownBackgroundColor,
        },
        yearSelectDropDownTextColor: {
          label: "Dropdown Text",
          value: yearSelectDropDownTextColor,
          onChange: throttled.yearSelectDropDownTextColor,
        },
        yearSelectDropDownActiveTextColor: {
          label: "Dropdown Active Text",
          value: yearSelectDropDownActiveTextColor,
          onChange: throttled.yearSelectDropDownActiveTextColor,
        },
        yearSelectDropDownActiveBackgroundColor: {
          label: "Dropdown Active Background",
          value: yearSelectDropDownActiveBackgroundColor,
          onChange: throttled.yearSelectDropDownActiveBackgroundColor,
        },
        yearSelectDropDownIconColor: {
          label: "Dropdown Icon",
          value: yearSelectDropDownIconColor,
          onChange: throttled.yearSelectDropDownIconColor,
        },
        yearSelectDropDownHoverBackgroundColor: {
          label: "Dropdown Hover Background",
          value: yearSelectDropDownHoverBackgroundColor,
          onChange: throttled.yearSelectDropDownHoverBackgroundColor,
        },
        yearSelectDropDownHoverTextColor: {
          label: "Dropdown Hover Text",
          value: yearSelectDropDownHoverTextColor,
          onChange: throttled.yearSelectDropDownHoverTextColor,
        },
      }}
    />
  )
}
