import React from "react";
import Login from "@/components/pages/Login";
import { validateOrg } from "@/actions/auth/ValidateOrg";
import { redirect } from "next/navigation";

const AffiliateLoginPage = async ({
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
      <Login orgId={params.orgId} />
    </>
  );
};
export default AffiliateLoginPage;
