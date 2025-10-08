"use client"

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch"
import { useAtom } from "jotai"
import { dialogCustomizationAtom } from "@/store/DashboardCustomizationAtom"
import { useThrottledOptionsUpdater } from "@/hooks/useThrottledOptionsUpdater"

export const DialogCustomizationOptions = ({
  triggerSize,
  dropdownSize,
}: {
  triggerSize?: string
  dropdownSize?: string
}) => {
  const [
    { dialogBackgroundColor, dialogCloseIconColor, dialogCloseIconBorderColor },
    setDialogCustomization,
  ] = useAtom(dialogCustomizationAtom)
  const throttled = useThrottledOptionsUpdater(setDialogCustomization, 300)
  return (
    <OptionWithSwitch
      triggerSize={triggerSize}
      dropdownSize={dropdownSize}
      properties={{
        dialogBackgroundColor: {
          label: "Dialog Background Color",
          value: dialogBackgroundColor,
          onChange: throttled.dialogBackgroundColor,
        },
        dialogCloseIconColor: {
          label: "Close Icon Color",
          value: dialogCloseIconColor,
          onChange: throttled.dialogCloseIconColor,
        },
        dialogCloseIconBorderColor: {
          label: "Close Icon Border Color",
          value: dialogCloseIconBorderColor,
          onChange: throttled.dialogCloseIconBorderColor,
        },
      }}
    />
  )
}
