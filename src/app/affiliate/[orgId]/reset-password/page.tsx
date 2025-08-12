import React, { Suspense } from "react";
import ResetPassword from "@/components/pages/Reset-password";
import { validateOrg } from "@/util/ValidateOrg";
import { redirect } from "next/navigation";
import { getAuthCustomization } from "@/app/seller/[orgId]/dashboard/customization/action";
import { OrgIdProps } from "@/lib/types/orgId";

const resetPasswordPage = async ({ params }: OrgIdProps) => {
  const { orgId } = await params;
  const org = await validateOrg(orgId);
  if (!org.orgFound) {
    redirect(`/affiliate/${orgId}/not-found`);
  }
  const auth = await getAuthCustomization(orgId);
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPassword auth={auth} affiliate />
      </Suspense>
    </>
  );
};
export default resetPasswordPage;
