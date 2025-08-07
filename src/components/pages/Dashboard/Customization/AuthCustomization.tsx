"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import Login from "@/components/pages/Login";
import Signup from "@/components/pages/Signup";

import ForgotPassword from "@/components/pages/Forgot-password";
import ResetPassword from "@/components/pages/Reset-password";
import InvalidToken from "@/components/pages/InvalidToken";
import EmailVerified from "@/components/pages/Email-verified";
interface AuthCustomizationProps {
  setMainTab?: (tab: string) => void;
}
export const AuthCustomization = ({ setMainTab }: AuthCustomizationProps) => {
  const [tab, setTab] = useState("login");
  return (
    <>
      <div className="border rounded-lg p-4 transition-all duration-300 mt-6 shadow-md">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="flex flex-wrap gap-2 mb-4 overflow-x-auto whitespace-nowrap">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Signup</TabsTrigger>
            <TabsTrigger value="forgot-password">Forgot Password</TabsTrigger>
            <TabsTrigger value="reset-password">Reset Password</TabsTrigger>
            <TabsTrigger value="invalid-token">Invalid Token</TabsTrigger>
            <TabsTrigger value="email-verified">Email Verified</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Login isPreview setTab={setTab} />
          </TabsContent>
          <TabsContent value="signup">
            <Signup isPreview setTab={setTab} />
          </TabsContent>
          <TabsContent value="forgot-password">
            <ForgotPassword isPreview setTab={setTab} />
          </TabsContent>
          <TabsContent value="reset-password">
            <ResetPassword isPreview setTab={setTab} />
          </TabsContent>
          <TabsContent value="invalid-token">
            <InvalidToken isPreview />
          </TabsContent>{" "}
          <TabsContent value="email-verified">
            <EmailVerified isPreview setMainTab={setMainTab} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
