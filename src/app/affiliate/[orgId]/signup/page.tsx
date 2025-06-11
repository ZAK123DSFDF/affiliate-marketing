import React from "react";
import Signup from "@/components/pages/Signup";
import { validateOrg } from "@/actions/auth/ValidateOrg";
import { redirect } from "next/navigation";

const AffiliateSignupPage = async ({
  params,
}: {
  params: { orgId: string };
}) => {
  const org = await validateOrg(params.orgId);
  if (!org.orgFound) {
    redirect(`/affiliate/${params.orgId}/not-found`);
  }
  return (
    <>
      <Signup orgId={params.orgId} />
    </>
  );
};
export default AffiliateSignupPage;
