"use client"

import { ResettableColorInput } from "@/components/ui-custom/ResettableColorInput"
import { useAtom } from "jotai"
import { toastCustomizationAtom } from "@/store/DashboardCustomizationAtom"
import { useThrottledUpdater } from "@/hooks/useThrottledUpdater"

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
  const throttled = useThrottledUpdater(setToastCustomization, 300)
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
      onChange={throttled[name]}
      showLabel={showLabel}
      buttonSize={buttonSize}
    />
  )
}
