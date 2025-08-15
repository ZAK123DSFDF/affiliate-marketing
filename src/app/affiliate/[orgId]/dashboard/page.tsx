// app/dashboard/page.tsx
import AffiliateOverview from "@/components/pages/AffiliateDashboard/AffiliateOverview/AffiliateOverview";
import { validateOrg } from "@/util/ValidateOrg";
import { redirect } from "next/navigation";
import { OrgIdProps } from "@/lib/types/orgId";
import {
  getAffiliateKpiStats,
  getAffiliateReferrers,
} from "@/app/affiliate/[orgId]/dashboard/action";

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
  const referrerStats = await getAffiliateReferrers();
  if (!referrerStats.ok) {
    redirect(`/error?message=${encodeURIComponent(referrerStats.error)}`);
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
