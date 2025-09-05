"use client"
import React, { useState } from "react"
import { Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import Link from "next/link"
import { InputField } from "@/components/Auth/FormFields"
import { SignUpFormValues, signUpSchema } from "@/lib/schema/signupSchema"
import { useMutation } from "@tanstack/react-query"
import { SignupAffiliateServer } from "@/app/affiliate/[orgId]/signup/action"
import { SignupServer } from "@/app/(seller)/signup/action"
import {
  useButtonCustomizationOption,
  useNotesCustomizationOption,
  useThemeCustomizationOption,
} from "@/hooks/useAuthCustomization"

import { CardCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/CardCustomizationOptions"
import { InputCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/InputCustomizationOptions"
import { InlineNotesEditor } from "@/components/ui-custom/InlineEditor"
import { ButtonCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/ButtonCustomizationOptions"
import { ThemeCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/ThemeCustomizationOptions"
import { useCustomToast } from "@/components/ui-custom/ShowCustomToast"
import { LinkButton } from "@/components/ui-custom/LinkButton"
import { IsRichTextEmpty } from "@/util/IsRichTextEmpty"
import { useCustomizationSync } from "@/hooks/useCustomizationSync"
import PendingState from "@/components/ui-custom/PendingState"
import ErrorState from "@/components/ui-custom/ErrorState"
import { useAuthCard } from "@/hooks/useAuthCard"
type Props = {
  orgId?: string
  isPreview?: boolean
  setTab?: (tab: string) => void
  affiliate: boolean
}
const Signup = ({ orgId, isPreview = false, setTab, affiliate }: Props) => {
  const [previewLoading, setPreviewLoading] = useState(false)
  const { customNotesSignup } = useNotesCustomizationOption()
  const { isPending, isError, refetch } = affiliate
    ? useCustomizationSync(orgId, "auth")
    : { isPending: false, isError: false, refetch: () => {} }
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })
  const { backgroundColor, linkTextColor, tertiaryTextColor } =
    useThemeCustomizationOption()
  const {
    buttonDisabledTextColor,
    buttonBackgroundColor,
    buttonDisabledBackgroundColor,
    buttonTextColor,
  } = useButtonCustomizationOption()
  const authCardStyle = useAuthCard(affiliate)
  const { showCustomToast } = useCustomToast()
  const affiliateMutation = useMutation({
    mutationFn: SignupAffiliateServer,
    onSuccess: (data) =>
      console.log("Affiliate signup success", data, affiliate),
  })

  const normalMutation = useMutation({
    mutationFn: SignupServer,
    onSuccess: (data) => console.log("Normal signup success", data),
  })
  const isLoading = isPreview
    ? previewLoading
    : orgId
      ? affiliateMutation.isPending
      : normalMutation.isPending

  const onSubmit = async (data: any) => {
    if (isPreview) {
      setPreviewLoading(true)
      await new Promise((res) => setTimeout(res, 1500))
      setPreviewLoading(false)

      if (data.email === "already@used.com") {
        showCustomToast({
          type: "error",
          title: "Signup Failed",
          description: "This Email Already Registered",
          affiliate,
        })
      } else {
        showCustomToast({
          type: "success",
          title: "Signup Successful",
          description: "Your Account Have Created",
          affiliate,
        })
      }

      return
    }
    try {
      if (orgId) {
        affiliateMutation.mutate({ ...data, organizationId: orgId })
      } else {
        normalMutation.mutate(data)
      }
    } catch (err) {
      console.error("Signup failed:", err)
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
          className="relative transition-shadow duration-300 "
          style={authCardStyle}
        >
          <CardHeader className="space-y-1">
            {isPreview ? (
              <InlineNotesEditor name="customNotesSignup" />
            ) : affiliate && !IsRichTextEmpty(customNotesSignup) ? (
              <div
                className="rich-text-preview"
                dangerouslySetInnerHTML={{ __html: customNotesSignup }}
              />
            ) : (
              <>
                <h2 className="text-2xl font-bold text-center">
                  Create An Account
                </h2>
                <p className="text-center text-muted-foreground">
                  Enter Your Information to Sign Up
                </p>
              </>
            )}
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="relative space-y-4"
              >
                {isPreview && (
                  <div className="absolute top-[-10] right-0 z-50">
                    <InputCustomizationOptions size="w-6 h-6" />
                  </div>
                )}
                <InputField
                  control={form.control}
                  name="name"
                  label="Full name"
                  placeholder="john doe"
                  type="text"
                  icon={User}
                  affiliate={affiliate}
                />

                <InputField
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="john.doe@example.com"
                  type="email"
                  icon={Mail}
                  affiliate={affiliate}
                />

                <InputField
                  control={form.control}
                  name="password"
                  label="Password"
                  placeholder="••••••••"
                  type="password"
                  icon={Lock}
                  showPasswordToggle={true}
                  affiliate={affiliate}
                />

                <InputField
                  control={form.control}
                  name="confirmPassword"
                  label="Confirm Password"
                  placeholder="••••••••"
                  type="password"
                  icon={Lock}
                  showPasswordToggle={true}
                  affiliate={affiliate}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                  style={{
                    backgroundColor: isLoading
                      ? (affiliate && buttonDisabledBackgroundColor) ||
                        undefined
                      : (affiliate && buttonBackgroundColor) || undefined,
                    color: isLoading
                      ? (affiliate && buttonDisabledTextColor) || undefined
                      : (affiliate && buttonTextColor) || undefined,
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2
                        className="h-4 w-4 animate-spin"
                        style={{
                          color:
                            (affiliate && buttonDisabledTextColor) || undefined,
                        }}
                      />
                      Please wait...
                    </>
                  ) : (
                    <>
                      Sign up{" "}
                      <ArrowRight
                        className="h-4 w-4"
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
                <span>Already have an account?</span>
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
                  href="/login"
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

export default Signup
