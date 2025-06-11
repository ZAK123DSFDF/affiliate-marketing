import React from "react";
import Signup from "@/components/pages/Signup";
import { validateOrg } from "@/actions/auth/ValidateOrg";
import { redirect } from "next/navigation";
interface AffiliateSignupPageProps {
  params: Promise<{ orgId: string }>;
}
const AffiliateSignupPage = async ({ params }: AffiliateSignupPageProps) => {
  const { orgId } = await params;
  const org = await validateOrg(orgId);
  if (!org.orgFound) {
    redirect(`/affiliate/${orgId}/not-found`);
  }
  return (
    <>
      <Signup orgId={orgId} />
    </>
  );
};
export default AffiliateSignupPage;
