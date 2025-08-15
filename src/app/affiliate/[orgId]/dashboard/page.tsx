// app/dashboard/page.tsx
import AffiliateOverview from "@/components/pages/AffiliateDashboard/AffiliateOverview/AffiliateOverview";
import { validateOrg } from "@/util/ValidateOrg";
import { redirect } from "next/navigation";
import { OrgIdProps } from "@/lib/types/orgId";
import { getAffiliateKpiStats } from "@/app/affiliate/[orgId]/dashboard/action";

const DashboardPage = async ({ params }: OrgIdProps) => {
  const { orgId } = await params;
  const org = await validateOrg(orgId);

  if (!org.orgFound) {
    redirect(`/affiliate/${orgId}/not-found`);
  }
  const kpiCardStats = await getAffiliateKpiStats();
  if (!kpiCardStats.ok) {
    redirect(`/error?message=${encodeURIComponent(kpiCardStats.error)}`);
  }
  return (
    <>
      <AffiliateOverview
        kpiCardStats={kpiCardStats.data}
        affiliate
        orgId={orgId}
      />
    </>
  );
};

export default DashboardPage;
