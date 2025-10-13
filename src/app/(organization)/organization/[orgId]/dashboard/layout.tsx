// app/dashboard/layout.tsx
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import SellerDashboardSidebar from "@/components/SellerDashboardSidebar"
import { OrgIdProps } from "@/lib/types/orgId"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { getUserPlan } from "@/lib/server/getUserPlan"
import { requireSellerWithOrg } from "@/lib/server/authGuards"
import { getUserOrgs } from "@/lib/server/getUserOrgs"
import { getUserData } from "@/app/(organization)/seller/[orgId]/dashboard/profile/action"
interface SellerDashboardLayoutProps extends OrgIdProps {
  children: React.ReactNode
}
export default async function DashboardLayout({
  children,
  params,
}: SellerDashboardLayoutProps) {
  const orgId = await getValidatedOrgFromParams({ params })
  const decoded = await requireSellerWithOrg(orgId)
  const plan = await getUserPlan()
  const orgs = await getUserOrgs(decoded.id)
  const userResponse = await getUserData()
  const user = userResponse.ok ? userResponse.data : null
  return (
    <SidebarProvider affiliate={false} orgId={orgId}>
      <SellerDashboardSidebar
        orgId={orgId}
        plan={plan}
        orgs={orgs}
        UserData={user}
      />
      <SidebarInset className="bg-background">
        <div className="py-6 px-6 w-full max-w-7xl mx-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
