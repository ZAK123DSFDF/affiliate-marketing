"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useThemeCustomizationOption } from "@/hooks/useAuthCustomization"
import { ThemeCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/ThemeCustomizationOptions"
import { CardCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/CardCustomizationOptions"
import { useCustomizationSync } from "@/hooks/useCustomizationSync"
import PendingState from "@/components/ui-custom/PendingState"
import ErrorState from "@/components/ui-custom/ErrorState"
import { useAuthCard } from "@/hooks/useAuthCard"

type Props = {
  orgId?: string
  isPreview?: boolean
  affiliate: boolean
}

const CheckEmail = ({ orgId, isPreview, affiliate }: Props) => {
  const { isPending, isError, refetch } = affiliate
    ? useCustomizationSync(orgId, "auth")
    : { isPending: false, isError: false, refetch: () => {} }

  const { backgroundColor, primaryCustomization, secondaryCustomization } =
    useThemeCustomizationOption()

  const authCardStyle = useAuthCard(affiliate)

  if (isPending) return <PendingState />
  if (isError) return <ErrorState onRetry={refetch} />

  return (
    <div
      className={`relative min-h-screen flex items-center justify-center p-4 ${
        affiliate && backgroundColor
          ? ""
          : "bg-gradient-to-b from-background to-background/80"
      }`}
      style={{ backgroundColor: (affiliate && backgroundColor) || undefined }}
    >
      <div className="w-full max-w-md">
        <Card
          className="relative transition-shadow duration-300"
          style={authCardStyle}
        >
          <CardHeader className="space-y-1">
            <div className="flex flex-row gap-2 justify-center">
              <CardTitle
                className="text-2xl font-bold text-center"
                style={{
                  color: (affiliate && primaryCustomization) || undefined,
                }}
              >
                Check Your Email
              </CardTitle>
              {isPreview && (
                <ThemeCustomizationOptions
                  name="primaryCustomization"
                  showLabel={false}
                  buttonSize="w-4 h-4"
                />
              )}
            </div>
          </CardHeader>

          <CardContent className="text-center">
            <div className="flex flex-col gap-2 justify-center">
              <p
                className="text-muted-foreground"
                style={{
                  color: (affiliate && secondaryCustomization) || undefined,
                }}
              >
                We’ve sent a verification email to your inbox. Please check your
                email and follow the link to complete login.
              </p>
              <p
                className="text-muted-foreground mt-2"
                style={{
                  color: (affiliate && secondaryCustomization) || undefined,
                }}
              >
                If you don’t see it, check your spam folder or try again.
              </p>
              {isPreview && (
                <ThemeCustomizationOptions
                  name="secondaryCustomization"
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

export default CheckEmail
