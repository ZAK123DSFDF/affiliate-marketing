"use client"

import React, { useState } from "react"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Link as LinkIcon,
  Users,
  Settings,
  CreditCard,
  Layers,
  User,
} from "lucide-react"
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
import CreateCompany from "@/components/pages/Create-Company"
import { DropdownInput } from "@/components/ui-custom/DropDownInput"
import { useSwitchOrg } from "@/hooks/useSwitchOrg"
import { OrganizationData, TeamData } from "@/lib/types/profileTypes"
import { AppDialog } from "@/components/ui-custom/AppDialog"

// Menu items for the sidebar

type Props = {
  orgId?: string
  TeamData: TeamData | null
  orgName?: string
}
const TeamDashboardSidebar = ({ orgId, TeamData, orgName }: Props) => {
  const pathname = usePathname()
  const items = [
    {
      title: "Dashboard",
      url: `/organization/${orgId}/teams/dashboard/analytics`,
      icon: BarChart3,
    },
    {
      title: "Affiliates",
      url: `/organization/${orgId}/teams/dashboard/affiliates`,
      icon: LinkIcon,
    },
    {
      title: "Payout",
      url: `/organization/${orgId}/teams/dashboard/payout`,
      icon: Users,
    },
    {
      title: "Customization",
      url: `/organization/${orgId}/teams/dashboard/customization`,
      icon: CreditCard,
    },
    {
      title: "Integration",
      url: `/organization/${orgId}/teams/dashboard/integration`,
      icon: Layers,
    },
    {
      title: "Settings",
      url: `/organization/${orgId}/teams/dashboard/settings`,
      icon: Settings,
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center py-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-md bg-primary/90 flex items-center justify-center text-white font-bold">
            A
          </div>
          <h1 className="text-xl font-bold">AffiliateX</h1>
        </div>
        <div className="text-sm font-medium text-muted-foreground truncate max-w-[150px] text-right">
          {orgName}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Link href={`/organization/${orgId}/teams/dashboard/profile`}>
          <div className="flex items-center space-x-3 p-2 rounded-md bg-primary/10 hover:bg-primary/15 transition-colors cursor-pointer">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{TeamData?.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {TeamData?.email}
              </p>
            </div>
            <User className="w-4 h-4 text-muted-foreground" />
          </div>
        </Link>
      </SidebarFooter>
    </Sidebar>
  )
}

export default TeamDashboardSidebar
