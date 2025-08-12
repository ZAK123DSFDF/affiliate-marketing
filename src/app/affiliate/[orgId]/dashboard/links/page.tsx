import React from "react";
import Links from "@/components/pages/AffiliateDashboard/Links/Links";
import { getAffiliateLinksWithStats } from "@/app/affiliate/[orgId]/dashboard/links/action";
import { redirect } from "next/navigation";
import { getDashboardCustomization } from "@/app/seller/[orgId]/dashboard/customization/action";
import { validateOrg } from "@/util/ValidateOrg";
import { OrgIdProps } from "@/lib/types/orgId";

const linksPage = async ({ params }: OrgIdProps) => {
  const { orgId } = await params;
  const org = await validateOrg(orgId);

  if (!org.orgFound) {
    redirect(`/affiliate/${orgId}/not-found`);
  }
  const links = await getAffiliateLinksWithStats();
  if (!links.ok) {
    redirect(`/error?message=${encodeURIComponent(links.error)}`);
  }
  const dashboard = await getDashboardCustomization(orgId);
  return (
    <>
      <Links affiliate data={links.data} dashboard={dashboard} />
    </>
  );
};
export default linksPage;
