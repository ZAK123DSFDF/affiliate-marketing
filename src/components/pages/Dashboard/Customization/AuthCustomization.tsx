"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Login from "@/components/pages/Login";
import Signup from "@/components/pages/Signup";

export const AuthCustomization = () => {
  const [customization, setCustomization] = useState({
    backgroundColor: "#f0f0f0",
    showShadow: true,
    borderColor: "#e5e7eb",
    errorColor: "#ef4444",
    buttonColor: "#2563eb",
    iconColor: "#6b7280",
    customHeader: "Welcome to AffiliateX",
  });

  const handleChange = (key: string, value: string | boolean) => {
    setCustomization((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Customize Auth Pages</h2>

      {/* Controls Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Custom Header Text</Label>
          <Input
            value={customization.customHeader}
            onChange={(e) => handleChange("customHeader", e.target.value)}
          />
        </div>
        <div>
          <Label>Background Color</Label>
          <Input
            type="color"
            value={customization.backgroundColor}
            onChange={(e) => handleChange("backgroundColor", e.target.value)}
          />
        </div>
        <div>
          <Label>Show Box Shadow</Label>
          <div className="flex items-center gap-2">
            <Switch
              checked={customization.showShadow}
              onCheckedChange={(val) => handleChange("showShadow", val)}
            />
            <span className="text-muted-foreground text-sm">
              Toggle shadow around the card
            </span>
          </div>
        </div>
        <div>
          <Label>Border Color</Label>
          <Input
            type="color"
            value={customization.borderColor}
            onChange={(e) => handleChange("borderColor", e.target.value)}
          />
        </div>
        <div>
          <Label>Error Text Color</Label>
          <Input
            type="color"
            value={customization.errorColor}
            onChange={(e) => handleChange("errorColor", e.target.value)}
          />
        </div>
        <div>
          <Label>Button Color</Label>
          <Input
            type="color"
            value={customization.buttonColor}
            onChange={(e) => handleChange("buttonColor", e.target.value)}
          />
        </div>
        <div>
          <Label>Icon Color</Label>
          <Input
            type="color"
            value={customization.iconColor}
            onChange={(e) => handleChange("iconColor", e.target.value)}
          />
        </div>
      </div>

      {/* Preview Section */}
      <div
        className={`border rounded-lg p-4 transition-all duration-300 ${
          customization.showShadow ? "shadow-md" : ""
        }`}
        style={{
          backgroundColor: customization.backgroundColor,
          borderColor: customization.borderColor,
          borderWidth: 1,
        }}
      >
        <Tabs defaultValue="login">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Signup</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Login />
          </TabsContent>
          <TabsContent value="signup">
            <Signup />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
