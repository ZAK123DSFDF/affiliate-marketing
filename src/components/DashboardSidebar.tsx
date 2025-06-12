"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Home,
  Link as LinkIcon,
  Users,
  Settings,
  CreditCard,
  Layers,
  HelpCircle,
  User,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

// Menu items for the sidebar

type Props = {
  orgId?: string;
};
const DashboardSidebar = ({ orgId }: Props) => {
  const pathname = usePathname();
  const items = [
    {
      title: "Dashboard",
      url: orgId ? `/seller/${orgId}/dashboard` : "/dashboard",
      icon: BarChart3,
    },
    {
      title: "Affiliates",
      url: orgId
        ? `/seller/${orgId}/dashboard/affiliates`
        : "/dashboard/affiliates",
      icon: LinkIcon,
    },
    {
      title: "Payout",
      url: orgId ? `/seller/${orgId}/dashboard/payout` : "/dashboard/payout",
      icon: Users,
    },
    {
      title: "Customization",
      url: orgId
        ? `/seller/${orgId}/dashboard/customization`
        : "/dashboard/customization",
      icon: CreditCard,
    },
    {
      title: "Integration",
      url: orgId
        ? `/seller/${orgId}/dashboard/integration`
        : "/dashboard/integration",
      icon: Layers,
    },
    {
      title: "Settings",
      url: orgId
        ? `/seller/${orgId}/dashboard/settings`
        : "/dashboard/settings",
      icon: Settings,
    },
  ];
  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-center py-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-md bg-primary/90 flex items-center justify-center text-white font-bold">
            A
          </div>
          <h1 className="text-xl font-bold">AffiliateX</h1>
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
  );
};

export default DashboardSidebar;
