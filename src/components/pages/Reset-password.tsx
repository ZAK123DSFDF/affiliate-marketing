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
import { InputField } from "@/components/Auth/FormFields"
import {
  ResetPasswordFormValues,
  passwordSchema,
} from "@/lib/schema/passwordSchema"
import { CardCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/CardCustomizationOptions"
import { InputCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/InputCustomizationOptions"
import { ThemeCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/ThemeCustomizationOptions"
import { ButtonCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/ButtonCustomizationOptions"
import { useCustomToast } from "@/components/ui-custom/ShowCustomToast"
import { LinkButton } from "@/components/ui-custom/LinkButton"
import { useAuthCard } from "@/hooks/useAuthCard"
import { resetOrganizationPasswordServer } from "@/app/(organization)/(auth)/reset-password/action"
import { resetAffiliatePasswordServer } from "@/app/affiliate/[orgId]/(auth)/reset-password/action"
import { useAtomValue } from "jotai"
import {
  buttonCustomizationAtom,
  themeCustomizationAtom,
} from "@/store/AuthCustomizationAtom"
import { useAffiliatePath } from "@/hooks/useUrl"
import { OrgHeader } from "@/components/ui-custom/OrgHeader"
import { useAppMutation } from "@/hooks/useAppMutation"
import { resetTeamPasswordServer } from "@/app/(organization)/organization/[orgId]/teams/(auth)/reset-password/action"
type Props = {
  userId: string
  orgId?: string
  isPreview?: boolean
  setTab?: (tab: string) => void
  affiliate: boolean
  isTeam?: boolean
}
const ResetPassword = ({
  userId,
  orgId,
  isPreview = false,
  setTab,
  affiliate,
  isTeam = false,
}: Props) => {
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const [pending, setPending] = useState(false)
  const { getPath } = useAffiliatePath(orgId)
  const { showCustomToast } = useCustomToast()
  const {
    backgroundColor,
    linkTextColor,
    tertiaryTextColor,
    primaryCustomization,
    secondaryCustomization,
  } = useAtomValue(themeCustomizationAtom)
  const {
    buttonDisabledTextColor,
    buttonBackgroundColor,
    buttonDisabledBackgroundColor,
    buttonTextColor,
  } = useAtomValue(buttonCustomizationAtom)
  const authCardStyle = useAuthCard(affiliate)
  const affiliateMutation = useAppMutation(resetAffiliatePasswordServer, {
    affiliate,
    disableSuccessToast: true,
  })
  const normalMutation = useAppMutation(resetOrganizationPasswordServer, {
    affiliate,
    disableSuccessToast: true,
  })
  const teamMutation = useAppMutation(resetTeamPasswordServer, {
    affiliate,
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
      if (isTeam && orgId) {
        teamMutation.mutate({
          teamId: userId,
          orgId,
          password: data.password,
        })
      } else if (orgId && affiliate) {
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
  const isSubmitting =
    pending ||
    (affiliate
      ? affiliateMutation.isPending
      : isTeam
        ? teamMutation.isPending
        : normalMutation.isPending)
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
          <OrgHeader
            orgId={orgId}
            affiliate={affiliate}
            isPreview={isPreview}
          />
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
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: isSubmitting
                      ? (affiliate && buttonDisabledBackgroundColor) ||
                        undefined
                      : (affiliate && buttonBackgroundColor) || undefined,
                    color: isSubmitting
                      ? (affiliate && buttonDisabledTextColor) || undefined
                      : (affiliate && buttonTextColor) || undefined,
                  }}
                >
                  {isSubmitting ? (
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
                    isTeam && orgId
                      ? `/organization/${orgId}/teams/login`
                      : affiliate && orgId
                        ? getPath("login")
                        : "/login"
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
          <ThemeCustomizationOptions
            buttonSize="w-4 h-4 lg:w-8 lg:h-8"
            name="backgroundColor"
            showLabel={false}
          />
        </div>
      )}
    </div>
  )
}

export default ResetPassword
