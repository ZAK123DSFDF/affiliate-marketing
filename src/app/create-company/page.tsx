import React, { Suspense } from "react";
import CreateCompany from "@/components/pages/Create-Company";

const createCompanyPage = () => {
  return (
    <>
      <Suspense fallback={<div>loading...</div>}>
        <CreateCompany />
      </Suspense>
    </>
  );
};
export default createCompanyPage;
