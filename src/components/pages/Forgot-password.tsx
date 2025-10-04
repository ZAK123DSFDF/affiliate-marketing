"use client"
import React, { useState } from "react"
import { Mail, ArrowRight, Loader2 } from "lucide-react"

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
import { InputField } from "@/components/Auth/FormFields"
import {
  ForgotPasswordFormValues,
  forgotPasswordSchema,
} from "@/lib/schema/forgotPasswordSchema"
import { CardCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/CardCustomizationOptions"
import { InputCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/InputCustomizationOptions"
import { ThemeCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/ThemeCustomizationOptions"
import { ButtonCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/ButtonCustomizationOptions"
import { useCustomToast } from "@/components/ui-custom/ShowCustomToast"
import { LinkButton } from "@/components/ui-custom/LinkButton"
import { useAuthCard } from "@/hooks/useAuthCard"
import { ForgotPasswordServer } from "@/app/(seller)/forgot-password/action"
import { ForgotPasswordAffiliateServer } from "@/app/affiliate/[orgId]/(auth)/forgot-password/action"
import { useAuthMutation } from "@/hooks/useAuthMutation"
import { useAtomValue } from "jotai"
import {
  buttonCustomizationAtom,
  themeCustomizationAtom,
} from "@/store/AuthCustomizationAtom"
import { LogoUpload } from "@/components/ui-custom/LogoUpload"
import { useOrgLogo } from "@/hooks/useOrgLogo"
import { Organization } from "@/lib/types/orgAuth"
type Props = {
  orgId?: string
  isPreview?: boolean
  setTab?: (tab: string) => void
  affiliate: boolean
  org?: Organization
}
const ForgotPassword = ({
  orgId,
  isPreview = false,
  setTab,
  affiliate,
  org,
}: Props) => {
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })
  const [pending, setPending] = useState(false)
  const { logoUrl, setLogoUrl } = useOrgLogo(org?.logoUrl)
  const { showCustomToast } = useCustomToast()
  const {
    backgroundColor,
    linkTextColor,
    tertiaryTextColor,
    primaryCustomization,
    secondaryCustomization,
    headerColor,
  } = useAtomValue(themeCustomizationAtom)
  const {
    buttonDisabledTextColor,
    buttonBackgroundColor,
    buttonDisabledBackgroundColor,
    buttonTextColor,
  } = useAtomValue(buttonCustomizationAtom)
  const authCardStyle = useAuthCard(affiliate)
  const sellerMutation = useAuthMutation(ForgotPasswordServer, { affiliate })

  const affiliateMutation = useAuthMutation(ForgotPasswordAffiliateServer, {
    affiliate,
  })
  const onSubmit = async (data: ForgotPasswordFormValues) => {
    if (isPreview) {
      setPending(true)
      await new Promise((res) => setTimeout(res, 1500))
      setPending(false)

      if (data.email === "notfound@gmail.com") {
        showCustomToast({
          type: "error",
          title: "Email Not Found",
          description: "We couldn't find an account with this email.",
          affiliate,
        })
      } else {
        // Simulate success
        showCustomToast({
          type: "success",
          title: "Email Sent",
          description: "If the email exists, a reset link has been sent.",
          affiliate,
        })
      }

      return
    }
    if (orgId && affiliate) {
      affiliateMutation.mutate({ email: data.email, organizationId: orgId })
    } else {
      sellerMutation.mutate({ email: data.email })
    }
  }
  const isSubmitting = sellerMutation.isPending || affiliateMutation.isPending
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
          {affiliate || isPreview ? (
            <div className="flex items-center justify-center space-x-2 cursor-pointer">
              <LogoUpload
                value={logoUrl}
                onChange={setLogoUrl}
                affiliate={affiliate}
                orgId={orgId}
                orgName={org?.name}
                mode="avatar"
              />

              <h1
                className="text-4xl font-bold"
                style={{ color: (affiliate && headerColor) || undefined }}
              >
                {org?.name || "AffiliateX"}
              </h1>
              {isPreview && (
                <ThemeCustomizationOptions
                  name="headerColor"
                  showLabel={false}
                  buttonSize="w-4 h-4"
                />
              )}
            </div>
          ) : (
            <Link href="/" className="inline-block">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-8 h-8 rounded-md bg-primary/90 flex items-center justify-center text-white font-bold">
                  A
                </div>
                <h1 className="text-2xl font-bold">AffiliateX</h1>
              </div>
            </Link>
          )}
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
                Forgot Password
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
                Enter your email to receive a password reset link
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
                  name="email"
                  label="Email"
                  placeholder="john.doe@example.com"
                  type="email"
                  icon={Mail}
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
                      Sending email...
                    </>
                  ) : (
                    <>
                      Send Reset Link{" "}
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
              className="text-center text-sm"
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

export default ForgotPassword
