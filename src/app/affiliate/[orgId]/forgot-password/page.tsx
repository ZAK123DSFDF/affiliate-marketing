import React from "react";
import ForgotPassword from "@/components/pages/Forgot-password";
import { validateOrg } from "@/util/ValidateOrg";
import { redirect } from "next/navigation";
import { getAuthCustomization } from "@/app/seller/[orgId]/dashboard/customization/action";
import { OrgIdProps } from "@/lib/types/orgId";

const forgetPasswordPage = async ({ params }: OrgIdProps) => {
  const { orgId } = await params;
  const org = await validateOrg(orgId);
  if (!org.orgFound) {
    redirect(`/affiliate/${orgId}/not-found`);
  }
  return (
    <>
      <ForgotPassword affiliate />
    </>
  );
};
export default forgetPasswordPage;
