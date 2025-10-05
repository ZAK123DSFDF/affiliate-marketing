"use client"

import React from "react"
import { Loader2 } from "lucide-react"
import { useAtomValue } from "jotai"
import { themeCustomizationAtom } from "@/store/AuthCustomizationAtom"
import { ThemeCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/ThemeCustomizationOptions"

type PendingStateProps = {
  withoutBackground?: boolean
  message?: string
  affiliate: boolean
  isPreview?: boolean
}

const PendingState = ({
  withoutBackground,
  message = "Loading...",
  affiliate = false,
  isPreview = false,
}: PendingStateProps) => {
  const theme = useAtomValue(themeCustomizationAtom)

  const backgroundColor = affiliate ? theme.backgroundColor : undefined
  const spinnerColor = affiliate ? theme.splashLoadingColor : undefined
  const textColor = affiliate ? theme.splashLoadingTextColor : undefined

  return (
    <div
      className={` relative flex flex-col justify-center items-center h-screen space-y-6`}
      style={{
        backgroundColor: withoutBackground
          ? undefined
          : backgroundColor || "white",
      }}
    >
      {/* Spinner + customization */}
      <div className="flex items-center space-x-2">
        <Loader2
          className="w-16 h-16 animate-spin"
          style={{ color: spinnerColor || "rgb(59 130 246)" }} // fallback blue-500
        />
        {isPreview && (
          <ThemeCustomizationOptions
            name="splashLoadingColor"
            buttonSize="w-6 h-6"
          />
        )}
      </div>

      {/* Text + customization */}
      <div className="flex items-center space-x-2">
        <p
          className="text-lg font-medium"
          style={{ color: textColor || "rgb(75 85 99)" }} // fallback gray-600
        >
          {message}
        </p>
        {isPreview && (
          <ThemeCustomizationOptions
            name="splashLoadingTextColor"
            buttonSize="w-6 h-6"
          />
        )}
      </div>

      {/* Background customization (only when preview & background is shown) */}
      {isPreview && !withoutBackground && (
        <div className="absolute bottom-0 left-0 z-50">
          <ThemeCustomizationOptions name="backgroundColor" showLabel={false} />
        </div>
      )}
    </div>
  )
}

export default PendingState
