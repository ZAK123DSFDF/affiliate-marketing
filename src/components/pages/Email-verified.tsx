"use client"
import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  useButtonCustomizationOption,
  useThemeCustomizationOption,
} from "@/hooks/useAuthCustomization"
import { ThemeCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/ThemeCustomizationOptions"
import { CardCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/CardCustomizationOptions"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ButtonCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/ButtonCustomizationOptions"
import { useRouter } from "next/navigation"
import { useCustomizationSync } from "@/hooks/useCustomizationSync"
import PendingState from "@/components/ui-custom/PendingState"
import ErrorState from "@/components/ui-custom/ErrorState"
import { useAuthCard } from "@/hooks/useAuthCard"

type Props = {
  orgId?: string
  isPreview?: boolean
  setMainTab?: (tab: string) => void
  affiliate: boolean
}

const EmailVerified = ({ orgId, isPreview, setMainTab, affiliate }: Props) => {
  const { backgroundColor } = useThemeCustomizationOption()
  const { isPending, isError, refetch } = affiliate
    ? useCustomizationSync(orgId, "auth")
    : { isPending: false, isError: false, refetch: () => {} }
  const {
    emailVerifiedPrimaryColor,
    emailVerifiedSecondaryColor,
    emailVerifiedIconColor,
  } = useThemeCustomizationOption()
  const { buttonBackgroundColor, buttonTextColor } =
    useButtonCustomizationOption()
  const authCardStyle = useAuthCard(affiliate)
  const router = useRouter()
  const handleClick = () => {
    if (isPreview) {
      setMainTab?.("sidebar")
    } else {
      router.push("/dashboard")
    }
  }
  if (isPending) {
    return <PendingState />
  }
  if (isError) {
    return <ErrorState onRetry={refetch} />
  }
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
      <div className="relative w-full max-w-md">
        <Card
          className="relative transition-shadow duration-300"
          style={authCardStyle}
        >
          <CardHeader className="space-y-1 flex flex-col items-center">
            <div className="flex flex-row gap-2 justify-center">
              <CheckCircle2
                className="w-16 h-16 text-green-500"
                style={{
                  color: (affiliate && emailVerifiedIconColor) || undefined,
                }}
              />
              {isPreview && (
                <ThemeCustomizationOptions
                  name="emailVerifiedIconColor"
                  showLabel={false}
                  buttonSize="w-4 h-4"
                />
              )}
            </div>
            <div className="flex flex-row gap-2 justify-center">
              <CardTitle
                className="text-2xl font-bold text-center text-green-600"
                style={{
                  color: (affiliate && emailVerifiedPrimaryColor) || undefined,
                }}
              >
                Email Verified!
              </CardTitle>
              {isPreview && (
                <ThemeCustomizationOptions
                  name="emailVerifiedPrimaryColor"
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
                    (affiliate && emailVerifiedSecondaryColor) || undefined,
                }}
              >
                Your email address has been successfully verified. You can now
                access all features.
              </p>
              {isPreview && (
                <ThemeCustomizationOptions
                  name="emailVerifiedSecondaryColor"
                  showLabel={false}
                  buttonSize="w-4 h-4"
                />
              )}
            </div>

            <Button
              className="w-full mb-6"
              size="lg"
              onClick={handleClick}
              style={{
                backgroundColor:
                  (affiliate && buttonBackgroundColor) || undefined,
                color: (affiliate && buttonTextColor) || undefined,
              }}
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>

        {isPreview && (
          <div className="absolute bottom-0 right-0 p-2">
            <ButtonCustomizationOptions onlyShowEnabled size="w-6 h-6" />
          </div>
        )}

        {isPreview && (
          <div className="absolute bottom-0 left-0 p-2">
            <CardCustomizationOptions
              triggerSize="w-6 h-6"
              dropdownSize="w-[150px]"
            />
          </div>
        )}
      </div>

      {isPreview && (
        <div className="absolute bottom-0 left-0 z-50">
          <ThemeCustomizationOptions name="backgroundColor" showLabel={false} />
        </div>
      )}
    </div>
  )
}

export default EmailVerified
