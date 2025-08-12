// app/dashboard/page.tsx
import AffiliateOverview from "@/components/pages/AffiliateDashboard/AffiliateOverview/AffiliateOverview";
import { validateOrg } from "@/util/ValidateOrg";
import { redirect } from "next/navigation";
import { getDashboardCustomization } from "@/app/seller/[orgId]/dashboard/customization/action";
import { OrgIdProps } from "@/lib/types/orgId";

const DashboardPage = async ({ params }: OrgIdProps) => {
  const { orgId } = await params;
  const org = await validateOrg(orgId);

  if (!org.orgFound) {
    redirect(`/affiliate/${orgId}/not-found`);
  }

  const dashboard = await getDashboardCustomization(orgId);
  return (
    <>
      <AffiliateOverview dashboard={dashboard} affiliate />
    </>
  );
};

export default DashboardPage;
