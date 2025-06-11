import React from "react";
import Login from "@/components/pages/Login";
import { validateOrg } from "@/actions/auth/ValidateOrg";
import { redirect } from "next/navigation";
interface AffiliateLoginPageProps {
  params: Promise<{ orgId: string }>;
}
const AffiliateLoginPage = async ({ params }: AffiliateLoginPageProps) => {
  const { orgId } = await params;
  const org = await validateOrg(orgId);
  if (!org.orgFound) {
    redirect(`/affiliate/${orgId}/not-found`);
  }
  return (
    <>
      <Login orgId={orgId} />
    </>
  );
};
export default AffiliateLoginPage;
