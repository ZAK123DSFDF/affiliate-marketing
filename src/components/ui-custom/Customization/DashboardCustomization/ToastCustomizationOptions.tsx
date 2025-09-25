"use client"

import { ResettableColorInput } from "@/components/ui-custom/ResettableColorInput"
import { useAtom } from "jotai"
import { toastCustomizationAtom } from "@/store/DashboardCustomizationAtom"

// Valid keys for toast customization
type ToastColorKey =
  | "toastTitleColor"
  | "toastDescriptionColor"
  | "toastBackgroundColor"
  | "toastErrorTitleColor"
  | "toastErrorDescriptionColor"
  | "toastErrorBackgroundColor"

type Props = {
  name: ToastColorKey
  showLabel?: boolean
  buttonSize?: string
}

export const ToastCustomizationOptions = ({
  name,
  showLabel = true,
  buttonSize = "w-8 h-8",
}: Props) => {
  // read & write directly from jotai atom
  const [toastCustomization, setToastCustomization] = useAtom(
    toastCustomizationAtom
  )

  const labelMap: Record<ToastColorKey, string> = {
    toastTitleColor: "Success Toast Text Color",
    toastDescriptionColor: "Success Toast Secondary Text",
    toastBackgroundColor: "Success Toast Background",
    toastErrorTitleColor: "Error Toast Text Color",
    toastErrorDescriptionColor: "Error Toast Secondary Text",
    toastErrorBackgroundColor: "Error Toast Background",
  }

  return (
    <ResettableColorInput
      label={labelMap[name]}
      value={toastCustomization[name]}
      onChange={(val) =>
        setToastCustomization({
          ...toastCustomization,
          [name]: val,
        })
      }
      showLabel={showLabel}
      buttonSize={buttonSize}
    />
  )
}
