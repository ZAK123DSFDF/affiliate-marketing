"use client"

import React, { useState } from "react"
import { usePathname } from "next/navigation"
import { BarChart3, Link as LinkIcon, Users, User } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { SidebarCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/SidebarCustomizationOptions"
import { cn } from "@/lib/utils"
import { AffiliateData } from "@/lib/types/profileTypes"
import { useAtomValue } from "jotai"
import { sidebarCustomizationAtom } from "@/store/DashboardCustomizationAtom"
import { Organization } from "@/lib/types/orgAuth"
import { LogoUpload } from "@/components/ui-custom/LogoUpload"
import { useOrgLogo } from "@/hooks/useOrgLogo"
import { ThemeCustomizationOptions } from "@/components/ui-custom/Customization/AuthCustomization/ThemeCustomizationOptions"
import { themeCustomizationAtom } from "@/store/AuthCustomizationAtom"

type Props = {
  orgId?: string
  isPreview?: boolean
  onSelectPage?: (page: string) => void
  currentPage?: string
  affiliate: boolean
  AffiliateData?: AffiliateData | null
  org?: Organization
}

const AffiliateDashboardSidebar = ({
  orgId,
  isPreview = false,
  onSelectPage,
  currentPage,
  affiliate,
  AffiliateData,
  org,
}: Props) => {
  const pathname = usePathname()
  const items = [
    {
      title: "Dashboard",
      url: `/affiliate/${orgId}/dashboard/analytics`,
      icon: BarChart3,
    },
    {
      title: "Links",
      url: `/affiliate/${orgId}/dashboard/links`,
      icon: LinkIcon,
    },
    {
      title: "Payment",
      url: `/affiliate/${orgId}/dashboard/payment`,
      icon: Users,
    },
  ]
  const itemsPreview = [
    { title: "Dashboard", key: "dashboard", icon: BarChart3 },
    { title: "Links", key: "links", icon: LinkIcon },
    { title: "Payment", key: "payment", icon: Users },
  ]
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)
  const { headerColor } = useAtomValue(themeCustomizationAtom)
  const { logoUrl, setLogoUrl } = useOrgLogo(org?.logoUrl)
  const {
    sideBarHoverNavigationTextColor,
    sideBarHoverNavigationBackgroundColor,
    sideBarActiveNavigationBackgroundColor,
    sideBarProfileTextSecondaryColor,
    sideBarInActiveNavigationTextColor,
    sideBarNavigationFocusRingColor,
    sideBarProfileTextPrimaryColor,
    sideBarBackgroundColor,
    sideBarProfileBackgroundColor,
    sideBarActiveNavigationTextColor,
  } = useAtomValue(sidebarCustomizationAtom)
  const baseSidebarClass = isPreview ? "relative h-full" : "" // you can add full-screen layout styles here
  const setProfile = () => {
    onSelectPage && onSelectPage("profile")
  }
  return (
    <Sidebar className={baseSidebarClass}>
      <SidebarHeader
        className="flex items-center justify-center py-4"
        style={{
          backgroundColor:
            (affiliate && sideBarBackgroundColor) ||
            "hsl(var(--sidebar-background))",
        }}
      >
        {affiliate || isPreview ? (
          <div className="flex items-center space-x-2">
            <LogoUpload
              value={logoUrl}
              onChange={setLogoUrl} // read-only in sidebar
              affiliate={affiliate}
              orgId={orgId}
              orgName={org?.name}
              mode="avatar"
            />

            <h1
              className={`font-bold ${isPreview ? "text-lg" : "text-xl"}`}
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
            {isPreview && <SidebarCustomizationOptions triggerSize="w-6 h-6" />}
          </div>
        ) : (
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-md bg-primary/90 flex items-center justify-center text-white font-bold text-xs">
              A
            </div>
            <h1 className="font-bold text-xl">AffiliateX</h1>
          </Link>
        )}
      </SidebarHeader>

      <SidebarContent
        style={{
          backgroundColor:
            (affiliate && sideBarBackgroundColor) ||
            "hsl(var(--sidebar-background))",
        }}
      >
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {(isPreview ? itemsPreview : items).map((item: any) => {
                const isActive = currentPage === item.key
                const isHovered = hoveredKey === item.key

                const backgroundColor = isActive
                  ? (affiliate && sideBarActiveNavigationBackgroundColor) ||
                    "hsl(var(--sidebar-accent))"
                  : isHovered
                    ? (affiliate && sideBarHoverNavigationBackgroundColor) ||
                      undefined
                    : undefined

                const textColor = isActive
                  ? (affiliate && sideBarActiveNavigationTextColor) || undefined
                  : isHovered
                    ? (affiliate && sideBarHoverNavigationTextColor) ||
                      undefined
                    : (affiliate && sideBarInActiveNavigationTextColor) ||
                      undefined

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={!isPreview && pathname === item.url}
                      tooltip={item.title}
                    >
                      {isPreview ? (
                        <button
                          type="button"
                          onClick={() => onSelectPage && onSelectPage(item.key)}
                          onMouseEnter={() => setHoveredKey(item.key)}
                          onMouseLeave={() => setHoveredKey(null)}
                          className={cn(
                            "flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md transition-colors",
                            "focus:outline-none focus-visible:outline-none",
                            "focus-visible:ring-2 focus-visible:ring-red-500"
                          )}
                          style={{
                            backgroundColor: backgroundColor || undefined,
                            color: textColor || undefined,
                            ["--tw-ring-color" as any]:
                              (affiliate && sideBarNavigationFocusRingColor) ||
                              "hsl(var(--sidebar-ring))",
                          }}
                        >
                          <item.icon
                            className={cn("w-5 h-5", isActive && "font-medium")}
                            style={{ color: textColor || undefined }}
                          />
                          <span className={cn(isActive && "font-medium")}>
                            {item.title}
                          </span>
                        </button>
                      ) : (
                        <Link href={item.url}>
                          <item.icon className="w-5 h-5" />
                          <span className={isPreview ? "text-sm" : ""}>
                            {item.title}
                          </span>
                        </Link>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter
        className="p-4"
        style={{
          backgroundColor:
            (affiliate && sideBarBackgroundColor) ||
            "hsl(var(--sidebar-background))",
        }}
      >
        {isPreview ? (
          <div
            className="flex items-center space-x-3 p-2 rounded-md bg-primary/10 cursor-pointer"
            onClick={setProfile}
            style={{
              backgroundColor:
                (affiliate && sideBarProfileBackgroundColor) || undefined,
            }}
          >
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium truncate"
                style={{
                  color:
                    (affiliate && sideBarProfileTextPrimaryColor) || undefined,
                }}
              >
                John Doe
              </p>
              <p
                className="text-xs text-muted-foreground truncate"
                style={{
                  color:
                    (affiliate && sideBarProfileTextSecondaryColor) ||
                    undefined,
                }}
              >
                john.doe@example.com
              </p>
            </div>
            <User
              className="w-4 h-4 text-muted-foreground"
              style={{
                color:
                  (affiliate && sideBarProfileTextSecondaryColor) || undefined,
              }}
            />
          </div>
        ) : (
          <Link href={`/affiliate/${orgId}/dashboard/profile`}>
            <div className="flex items-center space-x-3 p-2 rounded-md bg-primary/10 hover:bg-primary/15 transition-colors cursor-pointer">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {AffiliateData?.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {AffiliateData?.email}
                </p>
              </div>
              <User className="w-4 h-4 text-muted-foreground" />
            </div>
          </Link>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}

export default AffiliateDashboardSidebar
