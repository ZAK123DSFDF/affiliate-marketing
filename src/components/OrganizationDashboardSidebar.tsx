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
  Plus,
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

import { Button } from "@/components/ui/button"

import { DropdownInput } from "@/components/ui-custom/DropDownInput"
import { useSwitchOrg } from "@/hooks/useSwitchOrg"
import { OrganizationData } from "@/lib/types/profileTypes"
import { AppDialog } from "@/components/ui-custom/AppDialog"

// Menu items for the sidebar

type Props = {
  orgId?: string
  plan: { plan: string }
  orgs: { id: string; name: string }[]
  UserData: OrganizationData | null
}
const OrganizationDashboardSidebar = ({
  orgId,
  plan,
  orgs,
  UserData,
}: Props) => {
  const pathname = usePathname()
  const { mutate: switchOrg, isPending } = useSwitchOrg()
  const items = [
    {
      title: "Dashboard",
      url: `/organization/${orgId}/dashboard/analytics`,
      icon: BarChart3,
    },
    {
      title: "Affiliates",
      url: `/organization/${orgId}/dashboard/affiliates`,
      icon: LinkIcon,
    },
    {
      title: "Payout",
      url: `/organization/${orgId}/dashboard/payout`,
      icon: Users,
    },
    {
      title: "Customization",
      url: `/organization/${orgId}/dashboard/customization`,
      icon: CreditCard,
    },
    {
      title: "Integration",
      url: `/organization/${orgId}/dashboard/integration`,
      icon: Layers,
    },
    {
      title: "Settings",
      url: `/organization/${orgId}/dashboard/settings`,
      icon: Settings,
    },
  ]
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectOpen, setSelectOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"create" | "upgrade">("create")

  const handleClick = () => {
    if (!canCreate) {
      setDialogMode("upgrade")
      setDialogOpen(true)
      return
    }
    setDialogMode("create")
    setDialogOpen(true)
  }
  const currentOrg = orgs?.find((o) => o.id === orgId)
  const canCreate =
    plan?.plan === "ULTIMATE" || (orgs?.length < 1 && plan?.plan !== "ULTIMATE")
  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center py-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-md bg-primary/90 flex items-center justify-center text-white font-bold">
            A
          </div>
          <h1 className="text-xl font-bold">AffiliateX</h1>
        </div>
        <div className="flex items-center space-x-2">
          {/* Org dropdown */}
          <DropdownInput
            label=""
            value={currentOrg?.id ?? ""}
            options={orgs.map((org) => ({
              label: org.name,
              value: org.id,
            }))}
            placeholder="No Org"
            width="w-40"
            onChange={(val) => switchOrg(val)}
            disabled={orgs.length === 0 || isPending}
            includeFooter
            onFooterClick={handleClick}
            selectOpen={selectOpen}
            setSelectOpen={(v) => !dialogOpen && setSelectOpen(v)}
          />
          <AppDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            affiliate={false}
            title={dialogMode === "upgrade" ? "Upgrade Required" : undefined}
            description={
              dialogMode === "upgrade"
                ? "Your subscription must be Ultimate to create a new company."
                : undefined
            }
            confirmText={dialogMode === "upgrade" ? "Upgrade" : "OK"}
            onConfirm={
              dialogMode === "upgrade"
                ? () => console.log("Redirect to upgrade flow 🚀")
                : undefined
            }
            showFooter={dialogMode === "upgrade"}
          >
            {dialogMode === "create" && (
              <div className="h-full overflow-y-auto max-h-[60vh]">
                <CreateCompany mode="add" embed />
              </div>
            )}
          </AppDialog>
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
        <Link href={`/organization/${orgId}/dashboard/profile`}>
          <div className="flex items-center space-x-3 p-2 rounded-md bg-primary/10 hover:bg-primary/15 transition-colors cursor-pointer">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{UserData?.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {UserData?.email}
              </p>
            </div>
            <User className="w-4 h-4 text-muted-foreground" />
          </div>
        </Link>
      </SidebarFooter>
    </Sidebar>
  )
}

export default OrganizationDashboardSidebar
