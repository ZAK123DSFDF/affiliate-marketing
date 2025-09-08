"use client"
import React, { useState } from "react"
import { Lock, ArrowRight, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import Link from "next/link"

import { useRouter } from "next/navigation"
import { InputField } from "@/components/Auth/FormFields"
import {
  ResetPasswordFormValues,
  passwordSchema,
} from "@/lib/schema/passwordSchema"
import {
  useButtonCustomizationOption,
  useThemeCustomizationOption,
} from "@/hooks/useAuthCustomization"
import { CardCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/CardCustomizationOptions"
import { InputCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/InputCustomizationOptions"
import { ThemeCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/ThemeCustomizationOptions"
import { ButtonCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/ButtonCustomizationOptions"
import { useCustomToast } from "@/components/ui-custom/ShowCustomToast"
import { LinkButton } from "@/components/ui-custom/LinkButton"
import { useCustomizationSync } from "@/hooks/useCustomizationSync"
import PendingState from "@/components/ui-custom/PendingState"
import ErrorState from "@/components/ui-custom/ErrorState"
import { useAuthCard } from "@/hooks/useAuthCard"
import { resetSellerPasswordServer } from "@/app/(seller)/reset-password/action"
import { resetAffiliatePasswordServer } from "@/app/affiliate/[orgId]/reset-password/action"
import { useMutation } from "@tanstack/react-query"
import { useAuthMutation } from "@/hooks/useAuthMutation"
type Props = {
  userId: string
  orgId?: string
  isPreview?: boolean
  setTab?: (tab: string) => void
  affiliate: boolean
}
const ResetPassword = ({
  userId,
  orgId,
  isPreview = false,
  setTab,
  affiliate,
}: Props) => {
  const { isPending, isError, refetch } = affiliate
    ? useCustomizationSync(orgId, "auth")
    : { isPending: false, isError: false, refetch: () => {} }
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const [pending, setPending] = useState(false)
  const { showCustomToast } = useCustomToast()
  const router = useRouter()
  const { backgroundColor, linkTextColor, tertiaryTextColor } =
    useThemeCustomizationOption()
  const {
    buttonDisabledTextColor,
    buttonBackgroundColor,
    buttonDisabledBackgroundColor,
    buttonTextColor,
  } = useButtonCustomizationOption()
  const { primaryCustomization, secondaryCustomization } =
    useThemeCustomizationOption()
  const authCardStyle = useAuthCard(affiliate)
  const affiliateMutation = useAuthMutation(resetAffiliatePasswordServer, {
    affiliate,
    redirectUrl: `/affiliate/${orgId}/dashboard/analytics`,
    disableSuccessToast: true,
  })
  const normalMutation = useAuthMutation(resetSellerPasswordServer, {
    affiliate,
    redirectUrl: `/seller/${orgId}/dashboard/analytics`,
    disableSuccessToast: true,
  })
  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (isPreview) {
      setPending(true)
      await new Promise((res) => setTimeout(res, 1500))
      setPending(false)

      if (data.password === "notcorrect123") {
        showCustomToast({
          type: "error",
          title: "something went wrong",
          description: "something went wrong",
          affiliate,
        })
      } else {
        // Simulate success
        showCustomToast({
          type: "success",
          title: "Password Changed Successfully",
          description: "Password Changed Successfully",
          affiliate,
        })
      }

      return
    }
    try {
      if (orgId && affiliate) {
        affiliateMutation.mutate({
          affiliateId: userId,
          orgId,
          password: data.password,
        })
      } else {
        normalMutation.mutate({
          userId,
          password: data.password,
        })
      }
    } catch (error) {
      console.error("Password reset failed", error)
    }
  }
  const isSubmitting = affiliateMutation.isPending || normalMutation.isPending
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
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 rounded-md bg-primary/90 flex items-center justify-center text-white font-bold">
                A
              </div>
              <h1 className="text-2xl font-bold">AffiliateX</h1>
            </div>
          </Link>
        </div>

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
                Reset Password
              </CardTitle>
              {isPreview && (
                <ThemeCustomizationOptions
                  name="primaryCustomization"
                  showLabel={false}
                  buttonSize="w-4 h-4"
                />
              )}
            </div>
            <div className="flex flex-row gap-2 justify-center">
              <CardDescription
                className="text-center"
                style={{
                  color: (affiliate && secondaryCustomization) || undefined,
                }}
              >
                Enter your new password
              </CardDescription>
              {isPreview && (
                <ThemeCustomizationOptions
                  name="secondaryCustomization"
                  showLabel={false}
                  buttonSize="w-4 h-4"
                />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="relative space-y-4"
              >
                {isPreview && (
                  <div className="absolute top-[-10] right-0">
                    <InputCustomizationOptions size="w-6 h-6" />
                  </div>
                )}
                <InputField
                  control={form.control}
                  name="password"
                  label="New Password"
                  placeholder="••••••••"
                  type="password"
                  icon={Lock}
                  showPasswordToggle={true}
                  affiliate={affiliate}
                />

                <InputField
                  control={form.control}
                  name="confirmPassword"
                  label="Confirm New Password"
                  placeholder="••••••••"
                  type="password"
                  icon={Lock}
                  showPasswordToggle={true}
                  affiliate={affiliate}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={pending || isSubmitting}
                  style={{
                    backgroundColor:
                      pending || isSubmitting
                        ? (affiliate && buttonDisabledBackgroundColor) ||
                          undefined
                        : (affiliate && buttonBackgroundColor) || undefined,
                    color:
                      pending || isSubmitting
                        ? (affiliate && buttonDisabledTextColor) || undefined
                        : (affiliate && buttonTextColor) || undefined,
                  }}
                >
                  {pending || isSubmitting ? (
                    <>
                      <Loader2
                        className="h-4 w-4 animate-spin mr-2"
                        style={{
                          color:
                            (affiliate && buttonDisabledTextColor) || undefined,
                        }}
                      />
                      Updating password...
                    </>
                  ) : (
                    <>
                      Reset Password{" "}
                      <ArrowRight
                        className="h-4 w-4 ml-2"
                        style={{
                          color: (affiliate && buttonTextColor) || undefined,
                        }}
                      />
                    </>
                  )}
                </Button>
                {isPreview && <ButtonCustomizationOptions size="w-6 h-6" />}
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div
              className="mt-4 text-center text-sm"
              style={{
                color: (affiliate && tertiaryTextColor) || undefined,
              }}
            >
              <div className="flex flex-row gap-2">
                {isPreview && (
                  <ThemeCustomizationOptions
                    name="tertiaryTextColor"
                    showLabel={false}
                    buttonSize="w-4 h-4"
                  />
                )}
                <span>Remember your password?</span>
              </div>
              <div className="flex flex-row gap-2 justify-center">
                {isPreview && (
                  <ThemeCustomizationOptions
                    name="linkTextColor"
                    showLabel={false}
                    buttonSize="w-4 h-4"
                  />
                )}
                <LinkButton
                  isPreview={isPreview}
                  label="Login"
                  tabName="login"
                  href={
                    affiliate && orgId ? `/affiliate/${orgId}/login` : "/login"
                  }
                  setTab={setTab}
                  linkTextColor={linkTextColor}
                />
              </div>
            </div>
          </CardFooter>
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

export default ResetPassword
