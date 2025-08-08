import React, { Suspense } from "react";
import ResetPassword from "@/components/pages/Reset-password";

const resetPasswordPage = () => {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPassword affiliate={false} />
      </Suspense>
    </>
  );
};
export default resetPasswordPage;
