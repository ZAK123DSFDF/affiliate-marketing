"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { BarChart3, Link as LinkIcon, Users, User } from "lucide-react";
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
} from "@/components/ui/sidebar";
import Link from "next/link";
import { dashboardCustomizationSettings } from "@/lib/types/dashboardCustomization";

type Props = {
  orgId?: string;
  isPreview?: boolean;
  onSelectPage?: (page: string) => void;
  currentPage?: string;
  customization?: dashboardCustomizationSettings;
};

const AffiliateDashboardSidebar = ({
  orgId,
  isPreview = false,
  onSelectPage,
  currentPage,
  customization,
}: Props) => {
  const pathname = usePathname();
  const items = [
    {
      title: "Dashboard",
      url: `/affiliate/${orgId}/dashboard`,
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
  ];
  const itemsPreview = [
    { title: "Dashboard", key: "dashboard", icon: BarChart3 },
    { title: "Links", key: "links", icon: LinkIcon },
    { title: "Payment", key: "payment", icon: Users },
  ];
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const baseSidebarClass = isPreview ? "relative h-full" : ""; // you can add full-screen layout styles here
  const setProfile = () => {
    onSelectPage && onSelectPage("profile");
  };
  return (
    <Sidebar className={baseSidebarClass}>
      <SidebarHeader
        className="flex items-center justify-center py-4"
        style={{
          backgroundColor: customization?.sideBarBackgroundColor || undefined,
        }}
      >
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-md bg-primary/90 flex items-center justify-center text-white font-bold text-xs">
            A
          </div>
          <h1 className={`font-bold ${isPreview ? "text-lg" : "text-xl"}`}>
            AffiliateX
          </h1>
        </div>
      </SidebarHeader>

      <SidebarContent
        style={{
          backgroundColor: customization?.sideBarBackgroundColor || undefined,
        }}
      >
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {(isPreview ? itemsPreview : items).map((item: any) => {
                const isActive = currentPage === item.key;
                const isHovered = hoveredKey === item.key;

                const backgroundColor = isActive
                  ? customization?.sideBarActiveNavigationBackgroundColor ||
                    "rgba(59, 130, 246, 0.1)"
                  : isHovered
                    ? customization?.sideBarHoverNavigationBackgroundColor ||
                      "rgba(229, 231, 235, 1)"
                    : undefined;

                const textColor = isActive
                  ? customization?.sideBarActiveNavigationTextColor || "#3B82F6"
                  : isHovered
                    ? customization?.sideBarHoverNavigationTextColor ||
                      "#111827"
                    : customization?.sideBarInActiveNavigationTextColor ||
                      "#6B7280";

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
                          className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md transition-colors"
                          style={{
                            backgroundColor: backgroundColor || undefined,
                            color: textColor || undefined,
                          }}
                        >
                          <item.icon
                            className="w-5 h-5"
                            style={{ color: textColor || undefined }}
                          />
                          <span>{item.title}</span>
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
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter
        className="p-4"
        style={{
          backgroundColor: customization?.sideBarBackgroundColor || undefined,
        }}
      >
        {isPreview ? (
          <div
            className="flex items-center space-x-3 p-2 rounded-md bg-primary/10 cursor-pointer"
            onClick={setProfile}
            style={{
              backgroundColor:
                customization?.sideBarProfileBackgroundColor || undefined,
            }}
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium truncate"
                style={{
                  color:
                    customization?.sideBarProfileTextPrimaryColor || undefined,
                }}
              >
                John Doe
              </p>
              <p
                className="text-xs text-muted-foreground truncate"
                style={{
                  color:
                    customization?.sideBarProfileTextSecondaryColor ||
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
                  customization?.sideBarProfileTextSecondaryColor || undefined,
              }}
            />
          </div>
        ) : (
          <Link href={`/affiliate/${orgId}/dashboard/profile`}>
            <div className="flex items-center space-x-3 p-2 rounded-md bg-primary/10 hover:bg-primary/15 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
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
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AffiliateDashboardSidebar;
