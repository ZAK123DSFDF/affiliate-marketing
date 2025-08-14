import React from "react";
import Login from "@/components/pages/Login";
import { validateOrg } from "@/util/ValidateOrg";
import { redirect } from "next/navigation";
import { OrgIdProps } from "@/lib/types/orgId";

const loginPage = async () => {
  return (
    <>
      <Login affiliate={false} />
    </>
  );
};
export default loginPage;
