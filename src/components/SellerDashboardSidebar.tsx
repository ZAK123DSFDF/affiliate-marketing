"use client"

import React, { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  BarChart3,
  Link as LinkIcon,
  Users,
  Settings,
  CreditCard,
  Layers,
  User,
  ChevronDown,
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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import CreateCompany from "@/components/pages/Create-Company"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  TooltipContent,
  TooltipTrigger,
  Tooltip,
} from "@/components/ui/tooltip"
import { DropdownInput } from "@/components/ui-custom/DropDownInput"
import { useCustomToast } from "@/components/ui-custom/ShowCustomToast"

// Menu items for the sidebar

type Props = {
  orgId?: string
  plan: { plan: string }
  orgs: { id: string; name: string }[]
}
const SellerDashboardSidebar = ({ orgId, plan, orgs }: Props) => {
  const pathname = usePathname()
  const { showCustomToast } = useCustomToast()
  const items = [
    {
      title: "Dashboard",
      url: `/seller/${orgId}/dashboard/analytics`,
      icon: BarChart3,
    },
    {
      title: "Affiliates",
      url: `/seller/${orgId}/dashboard/affiliates`,
      icon: LinkIcon,
    },
    {
      title: "Payout",
      url: `/seller/${orgId}/dashboard/payout`,
      icon: Users,
    },
    {
      title: "Customization",
      url: `/seller/${orgId}/dashboard/customization`,
      icon: CreditCard,
    },
    {
      title: "Integration",
      url: `/seller/${orgId}/dashboard/integration`,
      icon: Layers,
    },
    {
      title: "Settings",
      url: `/seller/${orgId}/dashboard/settings`,
      icon: Settings,
    },
  ]
  const [open, setOpen] = useState(false)
  const handleClick = () => {
    if (!canCreate) {
      showCustomToast({
        type: "error",
        title: "Upgrade Required",
        description: "you must be on the ultimate plan to add organization",
        affiliate: false,
      })
      return
    }
    setOpen(true)
  }
  const currentOrg = orgs?.find((o) => o.id === orgId)
  const canCreate =
    plan?.plan === "ULTIMATE" || (orgs?.length < 1 && plan?.plan !== "ULTIMATE")
  const router = useRouter()
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
            onChange={(val) => {
              router.push(`/seller/${val}/dashboard/analytics`)
            }}
            disabled={orgs.length === 0}
          />
          <Button size="icon" variant="default" onClick={handleClick}>
            <Plus className="w-4 h-4" />
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent affiliate={false} className="max-w-3xl">
              <CreateCompany mode="add" />
            </DialogContent>
          </Dialog>
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
        <Link href={`/seller/${orgId}/dashboard/profile`}>
          <div className="flex items-center space-x-3 p-2 rounded-md bg-primary/10 hover:bg-primary/15 transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">John Doe</p>
              <p className="text-xs text-muted-foreground truncate">
                john.doe@example.com
              </p>
            </div>
            <User className="w-4 h-4 text-muted-foreground" />
          </div>
        </Link>
      </SidebarFooter>
    </Sidebar>
  )
}

export default SellerDashboardSidebar
