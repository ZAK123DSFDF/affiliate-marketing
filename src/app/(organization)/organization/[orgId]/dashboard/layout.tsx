// app/dashboard/layout.tsx
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import OrganizationDashboardSidebar from "@/components/OrganizationDashboardSidebar"
import { OrgIdProps } from "@/lib/types/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { getUserPlan } from "@/lib/server/getUserPlan"
import { requireOrganizationWithOrg } from "@/lib/server/authGuards"
import { getUserOrgs } from "@/lib/server/getUserOrgs"
import { getUserData } from "@/app/(organization)/organization/[orgId]/dashboard/profile/action"
import React from "react"
import { SubscriptionStatusBanner } from "@/components/ui-custom/SubscriptionStatusBanner"
interface OrganizationDashboardLayoutProps extends OrgIdProps {
  children: React.ReactNode
}
export default async function DashboardLayout({
  children,
  params,
}: OrganizationDashboardLayoutProps) {
  const orgId = await getValidatedOrgFromParams({ params })
  const decoded = await requireOrganizationWithOrg(orgId)
  const plan = await getUserPlan()
  const orgs = await getUserOrgs(decoded.id)
  const userResponse = await getUserData()
  const user = userResponse.ok ? userResponse.data : null
  return (
    <SidebarProvider affiliate={false} orgId={orgId}>
      <OrganizationDashboardSidebar
        orgId={orgId}
        plan={plan}
        orgs={orgs}
        UserData={user}
      />
      <SidebarInset className="bg-background">
        <div className="py-6 px-6 w-full max-w-7xl mx-auto">
          <SubscriptionStatusBanner plan={plan} orgId={orgId} />
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
