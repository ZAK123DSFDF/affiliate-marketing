"use client"
import React from "react"
import { cn } from "@/lib/utils"
import { useAtomValue } from "jotai"
import { toastCustomizationAtom } from "@/store/DashboardCustomizationAtom"

type Props = {
  type: "success" | "error"
  title: string
  description: string
}

export const ToastPreview = ({ type, title, description }: Props) => {
  const {
    toastBackgroundColor,
    toastTitleColor,
    toastDescriptionColor,
    toastErrorBackgroundColor,
    toastErrorTitleColor,
    toastErrorDescriptionColor,
  } = useAtomValue(toastCustomizationAtom)

  const isError = type === "error"
  const bgColor = isError ? toastErrorBackgroundColor : toastBackgroundColor
  const titleColor = isError ? toastErrorTitleColor : toastTitleColor
  const descColor = isError ? toastErrorDescriptionColor : toastDescriptionColor
  const variantClasses = isError
    ? "border-destructive bg-destructive text-destructive-foreground"
    : "border bg-background text-foreground"

  return (
    <div
      className={cn(
        "w-full rounded-md p-4 shadow-[0_2px_8px_-1px_rgba(0,0,0,0.1)]",
        !bgColor && variantClasses
      )}
      style={{
        backgroundColor: bgColor || undefined,
      }}
    >
      <div
        className={cn("font-semibold")}
        style={{ color: titleColor || undefined }}
      >
        {title}
      </div>
      <div className={cn("text-sm")} style={{ color: descColor || undefined }}>
        {description}
      </div>
    </div>
  )
}
