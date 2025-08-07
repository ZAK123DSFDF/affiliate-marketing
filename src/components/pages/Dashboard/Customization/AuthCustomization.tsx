"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import Login from "@/components/pages/Login";
import Signup from "@/components/pages/Signup";

import ForgotPassword from "@/components/pages/Forgot-password";
import ResetPassword from "@/components/pages/Reset-password";
import InvalidToken from "@/components/pages/InvalidToken";
import EmailVerified from "@/components/pages/Email-verified";

export const AuthCustomization = () => {
  return (
    <>
      <div className="border rounded-lg p-4 transition-all duration-300 mt-6 shadow-md">
        <Tabs defaultValue="login">
          <TabsList className="flex flex-wrap gap-2 mb-4 overflow-x-auto whitespace-nowrap">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Signup</TabsTrigger>
            <TabsTrigger value="forgot-password">Forgot Password</TabsTrigger>
            <TabsTrigger value="reset-password">Reset Password</TabsTrigger>
            <TabsTrigger value="invalid-token">Invalid Token</TabsTrigger>
            <TabsTrigger value="email-verified">Email Verified</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Login isPreview />
          </TabsContent>
          <TabsContent value="signup">
            <Signup isPreview />
          </TabsContent>
          <TabsContent value="forgot-password">
            <ForgotPassword isPreview />
          </TabsContent>
          <TabsContent value="reset-password">
            <ResetPassword isPreview />
          </TabsContent>
          <TabsContent value="invalid-token">
            <InvalidToken isPreview />
          </TabsContent>{" "}
          <TabsContent value="email-verified">
            <EmailVerified isPreview />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
