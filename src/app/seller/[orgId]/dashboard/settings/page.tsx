import React from "react";
import Settings from "@/components/pages/Dashboard/Settings/Settings";
import { validateOrg } from "@/util/ValidateOrg";
import { redirect } from "next/navigation";
import { orgInfo } from "@/app/seller/[orgId]/dashboard/settings/action";
import { OrgIdProps } from "@/lib/types/orgId";

const SettingsPage = async ({ params }: OrgIdProps) => {
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

  // Now TypeScript knows orgResponse has a data property
  return <Settings orgData={orgResponse.data} />;
};

export default SettingsPage;
