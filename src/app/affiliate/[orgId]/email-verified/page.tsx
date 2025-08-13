import React from "react";
import EmailVerified from "@/components/pages/Email-verified";
import { validateOrg } from "@/util/ValidateOrg";
import { redirect } from "next/navigation";
import { getAuthCustomization } from "@/app/seller/[orgId]/dashboard/customization/action";
import { OrgIdProps } from "@/lib/types/orgId";

const emailVerifiedPage = async ({ params }: OrgIdProps) => {
  const { orgId } = await params;
  const org = await validateOrg(orgId);
  if (!org.orgFound) {
    redirect(`/affiliate/${orgId}/not-found`);
  }
  return (
    <>
      <EmailVerified affiliate />
    </>
  );
};
export default emailVerifiedPage;
