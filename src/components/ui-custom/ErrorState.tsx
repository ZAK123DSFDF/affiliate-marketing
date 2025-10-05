"use client"

import React from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAtomValue } from "jotai"
import {
  buttonCustomizationAtom,
  themeCustomizationAtom,
} from "@/store/AuthCustomizationAtom"
import { ButtonCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/ButtonCustomizationOptions"
import { ThemeCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/ThemeCustomizationOptions"

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
  affiliate?: boolean
  isPreview?: boolean
}

const ErrorState: React.FC<ErrorStateProps> = ({
  message = "Something went wrong. Please try again.",
  onRetry,
  affiliate = false,
  isPreview = false,
}) => {
  const { buttonBackgroundColor, buttonTextColor } = useAtomValue(
    buttonCustomizationAtom
  )
  const theme = useAtomValue(themeCustomizationAtom)

  const iconColor = affiliate ? theme.splashErrorIconColor : undefined
  const textColor = affiliate ? theme.splashErrorTextColor : undefined

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white space-y-6">
      {/* Icon + customization */}
      <div className="flex items-center space-x-2">
        <AlertTriangle
          className="w-16 h-16"
          style={{ color: iconColor || "rgb(239 68 68)" }} // fallback red-500
        />
        {isPreview && (
          <ThemeCustomizationOptions
            name="splashErrorIconColor"
            buttonSize="w-6 h-6"
          />
        )}
      </div>

      {/* Text + customization */}
      <div className="flex items-center space-x-2">
        <p
          className="text-lg font-medium"
          style={{ color: textColor || "rgb(55 65 81)" }} // fallback gray-700
        >
          {message}
        </p>
        {isPreview && (
          <ThemeCustomizationOptions
            name="splashErrorTextColor"
            buttonSize="w-6 h-6"
          />
        )}
      </div>

      {/* Retry + button customization */}
      {(onRetry || isPreview) && (
        <div className="flex items-center space-x-3 mt-4">
          {onRetry && (
            <Button
              onClick={onRetry}
              style={{
                backgroundColor: affiliate ? buttonBackgroundColor : undefined,
                color: affiliate ? buttonTextColor : undefined,
              }}
            >
              Retry
            </Button>
          )}

          {isPreview && (
            <ButtonCustomizationOptions onlyShowEnabled size="w-6 h-6" />
          )}
        </div>
      )}
    </div>
  )
}

export default ErrorState
