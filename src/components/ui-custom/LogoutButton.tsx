"use client"

import { Button } from "@/components/ui/button"
import { UseMutationResult } from "@tanstack/react-query"
import { logoutButtonCustomizationAtom } from "@/store/DashboardCustomizationAtom"
import { useAtomValue } from "jotai"
import { LogoutButtonCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/LogoutButtonCustomizationOptions"

type LogoutButtonProps = {
  logoutMutation: UseMutationResult<any, any, void>
  affiliate: boolean
  isPreview?: boolean
}

export function LogoutButton({
  logoutMutation,
  affiliate,
  isPreview,
}: LogoutButtonProps) {
  const {
    logoutButtonBackgroundColor,
    logoutButtonTextColor,
    logoutButtonDisabledBackgroundColor,
    logoutButtonDisabledTextColor,
  } = useAtomValue(logoutButtonCustomizationAtom)

  const isDisabled = logoutMutation.isPending

  return (
    <div className="flex items-center space-x-6">
      <Button
        variant="destructive"
        onClick={() => logoutMutation.mutate()}
        disabled={isDisabled}
        style={
          affiliate
            ? {
                backgroundColor: isDisabled
                  ? logoutButtonDisabledBackgroundColor || undefined
                  : logoutButtonBackgroundColor || undefined,
                color: isDisabled
                  ? logoutButtonDisabledTextColor || undefined
                  : logoutButtonTextColor || undefined,
              }
            : undefined
        }
      >
        {isDisabled ? "Logging out..." : "Logout"}
      </Button>
      {isPreview && <LogoutButtonCustomizationOptions size="w-6 h-6" />}
    </div>
  )
}
