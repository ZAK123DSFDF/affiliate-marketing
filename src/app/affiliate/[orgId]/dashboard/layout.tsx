// app/dashboard/layout.tsx
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { OrgIdProps } from "@/lib/types/orgId"
import AffiliateDashboardSidebar from "@/components/AffiliateDashboardSidebar"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { getAffiliateData } from "@/app/affiliate/[orgId]/dashboard/profile/action"
import { CustomizationProvider } from "@/app/affiliate/[orgId]/dashboard/customizationProvider"
import { getOrg } from "@/lib/server/getOrg"
import { OrganizationProvider } from "@/components/layout/OrganizationProvider"

interface AffiliateDashboardLayoutProps extends OrgIdProps {
  children: React.ReactNode
}

export default async function DashboardLayout({
  children,
  params,
}: AffiliateDashboardLayoutProps) {
  const orgId = await getValidatedOrgFromParams({ params })
  const affiliateResponse = await getAffiliateData(orgId)
  const org = await getOrg(orgId)
  const affiliate = affiliateResponse.ok ? affiliateResponse.data : null
  return (
    <CustomizationProvider orgId={orgId}>
      <OrganizationProvider org={org}>
        <SidebarProvider affiliate orgId={orgId}>
          <AffiliateDashboardSidebar
            affiliate
            orgId={orgId}
            AffiliateData={affiliate}
          />
          <SidebarInset affiliate className="bg-background">
            <div className="py-6 px-6 w-full max-w-7xl mx-auto">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </OrganizationProvider>
    </CustomizationProvider>
  )
}
