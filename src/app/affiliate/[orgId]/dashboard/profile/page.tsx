import React from "react";
import Profile from "@/components/pages/Dashboard/Profile/Profile";
import { validateOrg } from "@/util/ValidateOrg";
import { redirect } from "next/navigation";
import { OrgIdProps } from "@/lib/types/orgId";
import { getAffiliateData } from "@/app/affiliate/[orgId]/dashboard/profile/action";

const profilePage = async ({ params }: OrgIdProps) => {
  const { orgId } = await params;
  const org = await validateOrg(orgId);

  if (!org.orgFound) {
    redirect(`/affiliate/${orgId}/not-found`);
  }

  const affiliateResponse = await getAffiliateData();
  if (!affiliateResponse.ok) {
    redirect(`/error?message=${encodeURIComponent(affiliateResponse.error)}`);
  }
  return (
    <>
      <Profile orgId={orgId} affiliate AffiliateData={affiliateResponse.data} />
    </>
  );
};
export default profilePage;
