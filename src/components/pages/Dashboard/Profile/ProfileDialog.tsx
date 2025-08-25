import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DialogCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/DialogCustomizationOptions"
import { DashboardThemeCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/DashboardThemeCustomizationOptions"
import { Form } from "@/components/ui/form"
import { InputCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/InputCustomizationOptions"
import { InputField } from "@/components/Auth/FormFields"
import { Loader2, Lock } from "lucide-react"
import { DashboardButtonCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/DashboardButtonCustomizationOptions"
import { Button } from "@/components/ui/button"
import React from "react"
import { UseFormReturn } from "react-hook-form"
import {
  currentPasswordSchema,
  newPasswordSchema,
} from "@/lib/schema/passwordSchema"
import { z } from "zod"
import {
  useDashboardButtonCustomizationOption,
  useDashboardThemeCustomizationOption,
} from "@/hooks/useDashboardCustomization"
type currentPasswordFormValues = z.infer<typeof currentPasswordSchema>
type newPasswordFormValues = z.infer<typeof newPasswordSchema>
interface ProfileDialogProps {
  showPasswordModal: boolean
  resetPasswordModal: () => void
  currentPasswordForm: UseFormReturn<currentPasswordFormValues>
  newPasswordForm: UseFormReturn<newPasswordFormValues>
  onSubmitValidateCurrent: (data: any) => void
  onSubmitUpdatePassword: (data: any) => void
  validatePassword: {
    isPending: boolean
  }
  updatePassword: {
    isPending: boolean
  }
  step: "current" | "new"
  affiliate: boolean
  isPreview?: boolean
}

export default function ProfileDialog({
  showPasswordModal,
  resetPasswordModal,
  currentPasswordForm,
  newPasswordForm,
  onSubmitValidateCurrent,
  onSubmitUpdatePassword,
  validatePassword,
  updatePassword,
  step,
  affiliate,
  isPreview = false,
}: ProfileDialogProps) {
  const dashboardTheme = useDashboardThemeCustomizationOption()
  const dashboardButton = useDashboardButtonCustomizationOption()
  return (
    <Dialog open={showPasswordModal} onOpenChange={resetPasswordModal}>
      <DialogContent affiliate={affiliate}>
        <DialogHeader>
          {isPreview && (
            <div className="absolute bottom-0 left-0 p-2">
              <DialogCustomizationOptions triggerSize="w-6 h-6" />
            </div>
          )}
          <DialogTitle
            style={{
              color:
                (affiliate && dashboardTheme.dialogHeaderColor) || undefined,
            }}
          >
            <div className="flex flex-row gap-2 items-center">
              {step === "current"
                ? "Verify Current Password"
                : "Set New Password"}
              {isPreview && (
                <DashboardThemeCustomizationOptions
                  name="dialogHeaderColor"
                  buttonSize="w-4 h-4"
                />
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        {step === "current" ? (
          <Form {...currentPasswordForm}>
            <form
              onSubmit={currentPasswordForm.handleSubmit(
                onSubmitValidateCurrent
              )}
              className=" relative space-y-4"
            >
              {isPreview && (
                <div className="absolute top-[20px] right-0 z-50">
                  <InputCustomizationOptions size="w-6 h-6" />
                </div>
              )}
              <InputField
                control={currentPasswordForm.control}
                name="currentPassword"
                label="Current Password"
                placeholder="Enter current password"
                type="password"
                icon={Lock}
                showPasswordToggle={true}
                affiliate={affiliate}
              />
              <DialogFooter>
                <div className="flex flex-row gap-2 items-center">
                  {isPreview && (
                    <DashboardButtonCustomizationOptions triggerSize="w-6 h-6" />
                  )}
                  <Button
                    type="submit"
                    disabled={validatePassword.isPending}
                    style={{
                      backgroundColor: validatePassword.isPending
                        ? (affiliate &&
                            dashboardButton.dashboardButtonDisabledBackgroundColor) ||
                          undefined
                        : (affiliate &&
                            dashboardButton.dashboardButtonBackgroundColor) ||
                          undefined,
                      color: validatePassword.isPending
                        ? (affiliate &&
                            dashboardButton.dashboardButtonDisabledTextColor) ||
                          undefined
                        : (affiliate &&
                            dashboardButton.dashboardButtonTextColor) ||
                          undefined,
                    }}
                  >
                    {validatePassword.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Validating
                      </>
                    ) : (
                      "Continue"
                    )}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <Form {...newPasswordForm}>
            <form
              key={step}
              onSubmit={newPasswordForm.handleSubmit(onSubmitUpdatePassword)}
              className="space-y-4 relative"
            >
              {isPreview && (
                <div className="absolute top-[20px] right-0 z-50">
                  <InputCustomizationOptions size="w-6 h-6" />
                </div>
              )}
              <InputField
                control={newPasswordForm.control}
                name="newPassword"
                label="New Password"
                placeholder="Enter new password"
                type="password"
                icon={Lock}
                showPasswordToggle
                affiliate={affiliate}
              />

              <InputField
                control={newPasswordForm.control}
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Re-enter password"
                type="password"
                icon={Lock}
                showPasswordToggle
                affiliate={affiliate}
              />

              <DialogFooter>
                <div className="flex flex-row gap-2 items-center">
                  {isPreview && (
                    <DashboardButtonCustomizationOptions triggerSize="w-6 h-6" />
                  )}
                  <Button
                    type="submit"
                    disabled={updatePassword.isPending}
                    style={{
                      backgroundColor: updatePassword.isPending
                        ? (affiliate &&
                            dashboardButton.dashboardButtonDisabledBackgroundColor) ||
                          undefined
                        : (affiliate &&
                            dashboardButton.dashboardButtonBackgroundColor) ||
                          undefined,
                      color: updatePassword.isPending
                        ? (affiliate &&
                            dashboardButton.dashboardButtonDisabledTextColor) ||
                          undefined
                        : (affiliate &&
                            dashboardButton.dashboardButtonTextColor) ||
                          undefined,
                    }}
                  >
                    {updatePassword.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
