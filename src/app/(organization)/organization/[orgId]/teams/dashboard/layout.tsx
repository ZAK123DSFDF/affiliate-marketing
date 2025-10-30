// app/dashboard/layout.tsx
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { OrgIdProps } from "@/lib/types/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { requireTeamWithOrg } from "@/lib/server/authGuards"
import React from "react"
import { getTeamData } from "@/app/(organization)/organization/[orgId]/teams/dashboard/profile/action"
import TeamDashboardSidebar from "@/components/TeamDashboardSidebar"
import { orgTeamInfo } from "@/app/(organization)/organization/[orgId]/teams/dashboard/settings/action"
import { ErrorCard } from "@/components/ui-custom/ErrorCard"
interface OrganizationDashboardLayoutProps extends OrgIdProps {
  children: React.ReactNode
}
export default async function DashboardLayout({
  children,
  params,
}: OrganizationDashboardLayoutProps) {
  const orgId = await getValidatedOrgFromParams({ params })
  await requireTeamWithOrg(orgId)
  const teamResponse = await getTeamData(orgId)
  const team = teamResponse.ok ? teamResponse.data : null
  const orgResponse = await orgTeamInfo(orgId)
  if (!orgResponse.ok) {
    return <ErrorCard message={orgResponse.error || "Something went wrong"} />
  }
  return (
    <SidebarProvider affiliate={false} orgId={orgId}>
      <TeamDashboardSidebar
        orgId={orgId}
        TeamData={team}
        orgName={orgResponse.data.name}
      />
      <SidebarInset className="bg-background">
        <div className="py-6 px-6 w-full max-w-7xl mx-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
