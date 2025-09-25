import { DashboardButtonCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/DashboardButtonCustomizationOptions"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import React from "react"
import { useAtomValue } from "jotai"
import { dashboardButtonCustomizationAtom } from "@/store/DashboardCustomizationAtom"
interface ProfileCardFooterProps {
  updateProfile: {
    isPending: boolean
  }
  isFormUnchanged: boolean
  affiliate: boolean
  isPreview?: boolean
}
export default function ProfileCardFooter({
  updateProfile,
  isFormUnchanged,
  affiliate = false,
  isPreview = false,
}: ProfileCardFooterProps) {
  const dashboardButton = useAtomValue(dashboardButtonCustomizationAtom)
  return (
    <div className="flex flex-row gap-2 items-center">
      {isPreview && (
        <DashboardButtonCustomizationOptions triggerSize="w-6 h-6" />
      )}
      <Button
        form="profile-form"
        type="submit"
        disabled={updateProfile.isPending || isFormUnchanged}
        style={{
          backgroundColor:
            updateProfile.isPending || isFormUnchanged
              ? (affiliate &&
                  dashboardButton.dashboardButtonDisabledBackgroundColor) ||
                undefined
              : (affiliate && dashboardButton.dashboardButtonBackgroundColor) ||
                undefined,
          color:
            updateProfile.isPending || isFormUnchanged
              ? (affiliate &&
                  dashboardButton.dashboardButtonDisabledTextColor) ||
                undefined
              : (affiliate && dashboardButton.dashboardButtonTextColor) ||
                undefined,
        }}
      >
        {updateProfile.isPending && (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        )}
        Save Changes
      </Button>
    </div>
  )
}
