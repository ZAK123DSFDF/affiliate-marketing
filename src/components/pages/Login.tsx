"use client"
import React, { useState } from "react"
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { InputField, CheckboxField } from "@/components/Auth/FormFields"
import { LoginFormValues, loginSchema } from "@/lib/schema/loginSchema"
import { useMutation } from "@tanstack/react-query"
import { LoginAffiliateServer } from "@/app/affiliate/[orgId]/login/action"
import { LoginServer } from "@/app/(seller)/login/action"
import {
  useButtonCustomizationOption,
  useNotesCustomizationOption,
  useThemeCustomizationOption,
} from "@/hooks/useAuthCustomization"
import { CardCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/CardCustomizationOptions"
import { CheckboxCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/CheckboxCustomizationOptions"
import { InputCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/InputCustomizationOptions"
import { ButtonCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/ButtonCustomizationOptions"
import { ThemeCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/ThemeCustomizationOptions"
import { InlineNotesEditor } from "@/components/ui-custom/InlineEditor"
import { useCustomToast } from "@/components/ui-custom/ShowCustomToast"
import { LinkButton } from "@/components/ui-custom/LinkButton"
import { IsRichTextEmpty } from "@/util/IsRichTextEmpty"
import { useCustomizationSync } from "@/hooks/useCustomizationSync"
import PendingState from "@/components/ui-custom/PendingState"
import ErrorState from "@/components/ui-custom/ErrorState"
import { useAuthCard } from "@/hooks/useAuthCard"
import { useRouter } from "next/navigation"
type Props = {
  orgId?: string
  isPreview?: boolean
  setTab?: (tab: string) => void
  affiliate: boolean
}
const Login = ({ orgId, isPreview = false, setTab, affiliate }: Props) => {
  const { showCustomToast } = useCustomToast()
  const router = useRouter()
  const [previewLoading, setPreviewLoading] = useState(false)
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
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
  const { customNotesLogin } = useNotesCustomizationOption()
  const { isPending, isError, refetch } = affiliate
    ? useCustomizationSync(orgId, "auth")
    : { isPending: false, isError: false, refetch: () => {} }
  const affiliateMutation = useMutation({
    mutationFn: LoginAffiliateServer,
    onSuccess: () => {
      router.push(`/affiliate/${orgId}/checkEmail`)
    },
  })
  const normalMutation = useMutation({
    mutationFn: LoginServer,
    onSuccess: () => {
      router.push(`/checkEmail`)
    },
  })
  const isLoading = isPreview
    ? previewLoading
    : orgId
      ? affiliateMutation.isPending
      : normalMutation.isPending
  const onSubmit = async (data: any) => {
    if (isPreview) {
      setPreviewLoading(true)

      // Simulate loading delay
      await new Promise((res) => setTimeout(res, 1500))

      setPreviewLoading(false)

      // Simulate error if password is "incorrect123"
      if (data.password === "incorrect123") {
        showCustomToast({
          type: "error",
          title: "Login Failed",
          description: "The password you entered is incorrect.",
          affiliate,
        })
      } else {
        showCustomToast({
          type: "success",
          title: "Login Successful",
          description: "Welcome back!",
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
    } catch (error) {
      console.error("Login failed", error)
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
          className="relative transition-shadow duration-300"
          style={authCardStyle}
        >
          <CardHeader className="space-y-1">
            {isPreview ? (
              <InlineNotesEditor name="customNotesLogin" />
            ) : affiliate && !IsRichTextEmpty(customNotesLogin) ? (
              <div
                className="rich-text-preview"
                dangerouslySetInnerHTML={{ __html: customNotesLogin }}
              />
            ) : (
              <>
                <h2 className="text-2xl font-bold text-center">Welcome back</h2>
                <p className="text-center text-muted-foreground">
                  Enter your credentials to access your account
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

                <div className="flex items-center justify-between">
                  <div className="flex flex-row gap-2">
                    <CheckboxField
                      control={form.control}
                      name="rememberMe"
                      label="Remember me"
                      affiliate={affiliate}
                    />
                    {isPreview && (
                      <CheckboxCustomizationOptions size="w-6 h-6" />
                    )}
                  </div>
                  <div className="flex flex-row gap-2">
                    {isPreview && (
                      <ThemeCustomizationOptions
                        name="linkTextColor"
                        showLabel={false}
                        buttonSize="w-4 h-4"
                      />
                    )}
                    <LinkButton
                      isPreview={isPreview}
                      label="Forgot Password"
                      tabName="forgot-password"
                      href="/forgot-password"
                      setTab={setTab}
                      linkTextColor={linkTextColor}
                    />
                  </div>
                </div>

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
                      Log in{" "}
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
                <span>Don't have an account? </span>
              </div>

              <LinkButton
                isPreview={isPreview}
                label="Sign up"
                tabName="signup"
                href="/signup"
                setTab={setTab}
                linkTextColor={linkTextColor}
              />
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

export default Login
