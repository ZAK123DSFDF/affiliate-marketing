import React, { Suspense } from "react";
import ResetPassword from "@/components/pages/Reset-password";
import { validateOrg } from "@/util/ValidateOrg";
import { redirect } from "next/navigation";
import { OrgIdProps } from "@/lib/types/orgId";

const resetPasswordPage = async () => {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPassword affiliate={false} />
      </Suspense>
    </>
  );
};
export default resetPasswordPage;
