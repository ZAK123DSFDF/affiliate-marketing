import React from "react";
import Login from "@/components/pages/Login";
import { validateOrg } from "@/util/ValidateOrg";
import { redirect } from "next/navigation";
import { OrgIdProps } from "@/lib/types/orgId";

const loginPage = async ({ params }: OrgIdProps) => {
  const { orgId } = await params;
  const org = await validateOrg(orgId);
  if (!org.orgFound) {
    redirect(`/affiliate/${orgId}/not-found`);
  }
  return (
    <>
      <Login orgId={orgId} affiliate={false} />
    </>
  );
};
export default loginPage;
