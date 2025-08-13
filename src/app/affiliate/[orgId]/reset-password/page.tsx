import React, { Suspense } from "react";
import ResetPassword from "@/components/pages/Reset-password";
import { validateOrg } from "@/util/ValidateOrg";
import { redirect } from "next/navigation";
import { OrgIdProps } from "@/lib/types/orgId";

const resetPasswordPage = async ({ params }: OrgIdProps) => {
  const { orgId } = await params;
  const org = await validateOrg(orgId);
  if (!org.orgFound) {
    redirect(`/affiliate/${orgId}/not-found`);
  }
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPassword affiliate />
      </Suspense>
    </>
  );
};
export default resetPasswordPage;
