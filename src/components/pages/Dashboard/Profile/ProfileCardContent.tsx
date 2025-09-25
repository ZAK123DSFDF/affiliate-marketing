import { Form } from "@/components/ui/form"
import { InputCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/InputCustomizationOptions"
import { InputField } from "@/components/Auth/FormFields"
import { Mail, User } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { DashboardThemeCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/DashboardThemeCustomizationOptions"
import { Button } from "@/components/ui/button"
import React from "react"
import { UseFormReturn } from "react-hook-form"
import { z } from "zod"
import {
  affiliateProfileSchema,
  userProfileSchema,
} from "@/lib/schema/profileSchema"
import { useAtomValue } from "jotai"
import {
  dashboardButtonCustomizationAtom,
  dashboardThemeCustomizationAtom,
} from "@/store/DashboardCustomizationAtom"
type UserProfileFormValues = z.infer<typeof userProfileSchema>
type AffiliateProfileFormValues = z.infer<typeof affiliateProfileSchema>

type ProfileFormValues = UserProfileFormValues | AffiliateProfileFormValues

interface ProfileContentProps {
  profileForm: UseFormReturn<ProfileFormValues>
  onSubmit: (data: ProfileFormValues) => void
  setShowPasswordModal: React.Dispatch<React.SetStateAction<boolean>>
  affiliate: boolean
  isPreview?: boolean
}
export default function ProfileCardContent({
  profileForm,
  onSubmit,
  setShowPasswordModal,
  affiliate,
  isPreview,
}: ProfileContentProps) {
  const { cardHeaderSecondaryTextColor, separatorColor } = useAtomValue(
    dashboardThemeCustomizationAtom
  )
  const { dashboardButtonBackgroundColor, dashboardButtonTextColor } =
    useAtomValue(dashboardButtonCustomizationAtom)
  return (
    <Form {...profileForm}>
      <form
        id="profile-form"
        onSubmit={profileForm.handleSubmit(onSubmit)}
        className="space-y-6 relative"
      >
        {isPreview && (
          <div className="absolute top-0 left-[16rem]">
            <InputCustomizationOptions size="w-6 h-6" />
          </div>
        )}
        <InputField
          control={profileForm.control}
          name="name"
          label="Username"
          placeholder="Enter your name"
          type="text"
          icon={User}
          profile
          affiliate={affiliate}
        />

        <InputField
          control={profileForm.control}
          name="email"
          label="Email Address"
          placeholder="john@example.com"
          type="email"
          icon={Mail}
          profile
          affiliate={affiliate}
        />
        {affiliate && (
          <InputField
            control={profileForm.control}
            name="paypalEmail"
            label="PayPal Email"
            placeholder="Enter your PayPal email"
            type="email"
            profile
            affiliate={affiliate}
          />
        )}

        <div>
          <div className="flex flex-row items-center justify-between mb-4 gap-1">
            <Separator
              className="flex-1"
              style={{
                backgroundColor: (affiliate && separatorColor) || "#e5e7eb",
              }}
            />
            {isPreview && (
              <DashboardThemeCustomizationOptions
                name="separatorColor"
                buttonSize="w-4 h-4"
              />
            )}
          </div>

          <div className="flex flex-row gap-2 mt-4 ">
            <h3
              className="font-medium mb-4"
              style={{
                color: (affiliate && cardHeaderSecondaryTextColor) || undefined,
              }}
            >
              Password
            </h3>
            {isPreview && (
              <DashboardThemeCustomizationOptions
                name="cardHeaderSecondaryTextColor"
                buttonSize="w-4 h-4"
              />
            )}
          </div>

          <Button
            type="button"
            onClick={() => setShowPasswordModal(true)}
            style={{
              backgroundColor:
                (affiliate && dashboardButtonBackgroundColor) || undefined,
              color: (affiliate && dashboardButtonTextColor) || undefined,
            }}
          >
            Change Password
          </Button>

          <Separator
            className="flex-1 mt-4"
            style={{
              backgroundColor: (affiliate && separatorColor) || "#e5e7eb",
            }}
          />
        </div>
      </form>
    </Form>
  )
}
