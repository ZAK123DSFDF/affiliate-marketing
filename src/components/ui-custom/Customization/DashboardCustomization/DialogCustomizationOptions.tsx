"use client"

import { OptionWithSwitch } from "@/components/ui-custom/OptionWithSwitch"
import { useAtom } from "jotai"
import { dialogCustomizationAtom } from "@/store/DashboardCustomizationAtom"

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

  return (
    <OptionWithSwitch
      triggerSize={triggerSize}
      dropdownSize={dropdownSize}
      properties={{
        dialogBackgroundColor: {
          label: "Dialog Background Color",
          value: dialogBackgroundColor,
          onChange: (val: string) =>
            setDialogCustomization((prev) => ({
              ...prev,
              dialogBackgroundColor: val,
            })),
        },
        dialogCloseIconColor: {
          label: "Close Icon Color",
          value: dialogCloseIconColor,
          onChange: (val: string) =>
            setDialogCustomization((prev) => ({
              ...prev,
              dialogCloseIconColor: val,
            })),
        },
        dialogCloseIconBorderColor: {
          label: "Close Icon Border Color",
          value: dialogCloseIconBorderColor,
          onChange: (val: string) =>
            setDialogCustomization((prev) => ({
              ...prev,
              dialogCloseIconBorderColor: val,
            })),
        },
      }}
    />
  )
}
