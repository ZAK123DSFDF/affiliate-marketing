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
  // Check if the response was successful
  if (!affiliateResponse.ok) {
    // Handle the error case - you might want to redirect or show an error
    redirect(`/error?message=${encodeURIComponent(affiliateResponse.error)}`);
  }
  return (
    <>
      <Profile affiliate AffiliateData={affiliateResponse.data} />
    </>
  );
};
export default profilePage;
