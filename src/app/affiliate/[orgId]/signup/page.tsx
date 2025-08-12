import React from "react";
import Signup from "@/components/pages/Signup";
import { validateOrg } from "@/util/ValidateOrg";
import { redirect } from "next/navigation";
import { OrgIdProps } from "@/lib/types/orgId";
import { getAuthCustomization } from "@/app/seller/[orgId]/dashboard/customization/action";
const AffiliateSignupPage = async ({ params }: OrgIdProps) => {
  const { orgId } = await params;
  const org = await validateOrg(orgId);
  if (!org.orgFound) {
    redirect(`/affiliate/${orgId}/not-found`);
  }
  const auth = await getAuthCustomization(orgId);
  return (
    <>
      <Signup affiliate orgId={orgId} auth={auth} />
    </>
  );
};
export default AffiliateSignupPage;
