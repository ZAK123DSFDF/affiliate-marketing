import { SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardThemeCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/DashboardThemeCustomizationOptions"
import React from "react"
import { useAtomValue } from "jotai"
import { dashboardThemeCustomizationAtom } from "@/store/DashboardCustomizationAtom"
interface HeaderProps {
  affiliate: boolean
  isPreview?: boolean
}
export default function ProfileHeader({
  affiliate = false,
  isPreview = false,
}: HeaderProps) {
  const dashboardTheme = useAtomValue(dashboardThemeCustomizationAtom)
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <div>
          <div className="flex flex-row gap-2 items-center">
            <h1
              className="text-3xl font-bold"
              style={{
                color:
                  (affiliate && dashboardTheme.dashboardHeaderNameColor) ||
                  undefined,
              }}
            >
              Profile Settings
            </h1>
            {isPreview && (
              <DashboardThemeCustomizationOptions
                name="dashboardHeaderNameColor"
                buttonSize="w-4 h-4"
              />
            )}
          </div>
          <div className="flex flex-row gap-2 items-center">
            <p
              className="text-muted-foreground"
              style={{
                color:
                  (affiliate && dashboardTheme.dashboardHeaderDescColor) ||
                  undefined,
              }}
            >
              Manage your account information
            </p>
            {isPreview && (
              <DashboardThemeCustomizationOptions
                name="dashboardHeaderDescColor"
                buttonSize="w-4 h-4"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
