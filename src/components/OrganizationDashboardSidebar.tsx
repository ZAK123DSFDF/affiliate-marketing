"use client"

import React, { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
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
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import CreateCompany from "@/components/pages/Create-Company"
import { DropdownInput } from "@/components/ui-custom/DropDownInput"
import { useSwitchOrg } from "@/hooks/useSwitchOrg"
import { OrganizationData } from "@/lib/types/profileTypes"
import { AppDialog } from "@/components/ui-custom/AppDialog"
import { PlanInfo } from "@/lib/types/planInfo"
import { Button } from "@/components/ui/button"
import { usePaddlePortal } from "@/hooks/usePaddlePortal"
import { handlePlanRedirect } from "@/util/HandlePlanRedirect"

// Menu items for the sidebar

type Props = {
  orgId?: string
  plan: PlanInfo
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
  if (plan.plan === "PRO" || plan.plan === "ULTIMATE") {
    items.push({
      title: "Teams",
      url: `/organization/${orgId}/dashboard/teams`,
      icon: Users,
    })
  }
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectOpen, setSelectOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<
    "create" | "upgrade" | "expired"
  >("create")
  const router = useRouter()
  const { openPortal } = usePaddlePortal(orgId)
  const { setOpenMobile, isMobile } = useSidebar()
  const handleClick = () => {
    setSelectOpen(false)

    // 🧠 Handle FREE users → show upgrade dialog (not redirect)
    if (plan.plan === "FREE") {
      setDialogMode("upgrade")
      setDialogOpen(true)
      return
    }

    // 🧠 Handle expired subscription users (PRO or ULTIMATE)
    if (
      plan.type === "EXPIRED" &&
      (plan.plan === "PRO" || plan.plan === "ULTIMATE")
    ) {
      setDialogMode("expired")
      setDialogOpen(true)
      return
    }

    // 🧠 Handle users that reached org limit and need upgrade
    if (!canCreate) {
      setDialogMode("upgrade")
      setDialogOpen(true)
      return
    }

    // 🧱 Default: open create company dialog
    setDialogMode("create")
    setDialogOpen(true)
  }

  const getUpgradeText = (plan: PlanInfo) => {
    if (plan.plan === "FREE") return "Upgrade or Purchase"
    if (plan.type === "EXPIRED" && plan.plan === "PRO")
      return "Renew Subscription"
    if (plan.type === "EXPIRED" && plan.plan === "ULTIMATE")
      return "Renew Subscription"
    if (plan.type === "PURCHASE" && plan.plan === "PRO")
      return "Purchase Ultimate Bundle"
    if (plan.type === "SUBSCRIPTION" && plan.plan === "PRO") return "Upgrade"
    return ""
  }
  const currentOrg = orgs?.find((o) => o.id === orgId)
  const canCreate =
    plan.plan === "ULTIMATE" || (plan.plan === "PRO" && orgs.length < 1)
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
            title={
              dialogMode === "upgrade"
                ? "Upgrade Required"
                : dialogMode === "expired"
                  ? "Plan Expired"
                  : undefined
            }
            description={
              dialogMode === "upgrade"
                ? plan.plan === "FREE"
                  ? "You need to upgrade or purchase a plan to create a new organization."
                  : plan.type === "PURCHASE"
                    ? "You need to purchase the Ultimate bundle to create a new company."
                    : "You need to upgrade to Ultimate to create a new company."
                : dialogMode === "expired"
                  ? `Your ${plan.plan} plan has expired. Please renew to continue accessing premium features.`
                  : undefined
            }
            confirmText={
              dialogMode === "upgrade"
                ? getUpgradeText(plan)
                : dialogMode === "expired"
                  ? "Renew Now"
                  : "OK"
            }
            onConfirm={
              dialogMode === "upgrade" || dialogMode === "expired"
                ? () => {
                    setDialogOpen(false)
                    setTimeout(() => handlePlanRedirect(orgId!, router), 150)
                  }
                : undefined
            }
            showFooter={dialogMode === "upgrade" || dialogMode === "expired"}
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
                    <Link
                      href={item.url}
                      onClick={() => {
                        if (isMobile) setOpenMobile(false)
                      }}
                    >
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

      <SidebarFooter className="p-4 space-y-2">
        {/* 🆓 FREE USERS → Upgrade or Purchase */}
        {plan.plan === "FREE" && (
          <Link
            href={`/organization/${orgId}/dashboard/pricing`}
            scroll={false}
            className="block w-full"
            onClick={() => {
              if (isMobile) setOpenMobile(false)
            }}
          >
            <Button className="w-full">Upgrade or Purchase</Button>
          </Link>
        )}

        {/* 💼 PRO PURCHASE USERS → Offer Ultimate purchase */}
        {plan.type === "PURCHASE" && plan.plan === "PRO" && (
          <Link
            href={`/organization/${orgId}/dashboard/pricing`}
            scroll={false}
            className="block w-full"
            onClick={() => {
              if (isMobile) setOpenMobile(false)
            }}
          >
            <Button className="w-full">Purchase Ultimate Bundle</Button>
          </Link>
        )}

        {/* 🔁 SUBSCRIPTION or EXPIRED → Manage + Purchase */}
        {(plan.type === "SUBSCRIPTION" || plan.type === "EXPIRED") &&
          (plan.plan === "PRO" || plan.plan === "ULTIMATE") && (
            <>
              {!plan.hasPendingPurchase && (
                <Button
                  className="w-full"
                  onClick={() => {
                    if (isMobile) setOpenMobile(false)
                    openPortal()
                  }}
                >
                  Manage Subscription
                </Button>
              )}

              <Link
                href={`/organization/${orgId}/dashboard/pricing`}
                scroll={false}
                className="block w-full"
                onClick={() => {
                  if (isMobile) setOpenMobile(false)
                }}
              >
                <Button variant="outline" className="w-full">
                  {plan.hasPendingPurchase
                    ? "Purchase One-Time Plan"
                    : "Change Plan"}
                </Button>
              </Link>
            </>
          )}

        <Link
          href={`/organization/${orgId}/dashboard/profile`}
          onClick={() => {
            if (isMobile) setOpenMobile(false)
          }}
        >
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
