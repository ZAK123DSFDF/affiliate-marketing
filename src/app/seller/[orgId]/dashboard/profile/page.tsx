import React from "react";
import Profile from "@/components/pages/Dashboard/Profile/Profile";
import { validateOrg } from "@/actions/auth/ValidateOrg";
import { redirect } from "next/navigation";
import { orgInfo } from "@/app/seller/[orgId]/dashboard/settings/action";
import { OrgIdProps } from "@/lib/types/orgId";

const profilePage = async ({ params }: OrgIdProps) => {
  const { orgId } = await params;
  const org = await validateOrg(orgId);

  if (!org.orgFound) {
    redirect(`/affiliate/${orgId}/not-found`);
  }

  const orgResponse = await orgInfo(orgId);
  // Check if the response was successful
  if (!orgResponse.ok) {
    // Handle the error case - you might want to redirect or show an error
    redirect(`/error?message=${encodeURIComponent(orgResponse.error)}`);
  }
  return (
    <>
      <Profile />
    </>
  );
};
export default profilePage;
