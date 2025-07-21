"use client";
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CustomizationForm } from "@/components/pages/Dashboard/Customization/Customization";
import { AuthCustomization } from "@/components/pages/Dashboard/Customization/AuthCustomization";
export default function CustomizationPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">
          Customize Your Affiliate Page
        </h2>
        <p className="text-sm text-muted-foreground">
          Adjust colors and layout settings to match your brand.
        </p>
      </div>

      <Tabs defaultValue="sidebar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sidebar">Sidebar</TabsTrigger>
          <TabsTrigger value="auth">Auth Pages</TabsTrigger>
        </TabsList>

        <TabsContent value="sidebar">
          <CustomizationForm />
        </TabsContent>

        <TabsContent value="auth">
          <AuthCustomization />
        </TabsContent>
      </Tabs>
    </div>
  );
}
