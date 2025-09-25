"use client"
import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/ThemeCustomizationOptions"
import { CardCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/CardCustomizationOptions"
import { useAuthCard } from "@/hooks/useAuthCard"
import { useAtomValue } from "jotai"
import { themeCustomizationAtom } from "@/store/AuthCustomizationAtom"
type Props = {
  orgId?: string
  isPreview?: boolean
  affiliate: boolean
  message?: string
}
const InvalidToken = ({ isPreview, affiliate, message }: Props) => {
  const {
    backgroundColor,
    InvalidPrimaryCustomization,
    InvalidSecondaryCustomization,
  } = useAtomValue(themeCustomizationAtom)
  const authCardStyle = useAuthCard(affiliate)
  return (
    <div
      className={`relative min-h-screen flex items-center justify-center p-4 ${
        affiliate && backgroundColor
          ? ""
          : "bg-gradient-to-b from-background to-background/80"
      }`}
      style={{
        backgroundColor: (affiliate && backgroundColor) || undefined,
      }}
    >
      <div className="w-full max-w-md">
        <Card
          className="relative transition-shadow duration-300"
          style={authCardStyle}
        >
          <CardHeader className="space-y-1">
            <div className="flex flex-row gap-2 justify-center">
              <CardTitle
                className="text-2xl font-bold text-center text-destructive"
                style={{
                  color:
                    (affiliate && InvalidPrimaryCustomization) || undefined,
                }}
              >
                Invalid Token
              </CardTitle>
              {isPreview && (
                <ThemeCustomizationOptions
                  name="InvalidPrimaryCustomization"
                  showLabel={false}
                  buttonSize="w-4 h-4"
                />
              )}
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex flex-row gap-2 justify-center">
              <p
                className="text-muted-foreground mb-4"
                style={{
                  color:
                    (affiliate && InvalidSecondaryCustomization) || undefined,
                }}
              >
                {message || "The verification link is invalid or has expired."}
              </p>
              {isPreview && (
                <ThemeCustomizationOptions
                  name="InvalidSecondaryCustomization"
                  showLabel={false}
                  buttonSize="w-4 h-4"
                />
              )}
            </div>
          </CardContent>
          {isPreview && (
            <div className="absolute bottom-0 left-0 p-2">
              <CardCustomizationOptions
                triggerSize="w-6 h-6"
                dropdownSize="w-[150px]"
              />
            </div>
          )}
        </Card>
      </div>
      {isPreview && (
        <div className="absolute bottom-0 left-0 z-50">
          <ThemeCustomizationOptions name="backgroundColor" showLabel={false} />
        </div>
      )}
    </div>
  )
}
export default InvalidToken
