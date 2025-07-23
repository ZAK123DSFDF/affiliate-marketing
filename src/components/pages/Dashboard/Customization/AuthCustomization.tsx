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
    shadowColor: "#000000",
    borderColor: "#e5e7eb",
    showBorder: true,
    includeOrgName: true,
    logoUrl: "",

    // Text Colors
    primaryTextColor: "#111827", // email/password/remember
    linkTextColor: "#2563eb", // forgot password, signup
    errorColor: "#ef4444", // error text
    inputBorderColor: "#d1d5db",
    inputBorderErrorColor: "#ef4444",
    inputBorderHoverColor: "#9ca3af",
    inputTextColor: "#111827",
    placeholderTextColor: "#6b7280",
    iconColor: "#6b7280",
    checkboxActiveColor: "#2563eb",
    checkboxInactiveColor: "#9ca3af",

    customNotes: "<p>Welcome! Please enter your credentials.</p>",
  });

  const handleChange = (key: string, value: string | boolean) => {
    setCustomization((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Background Color</Label>
          <Input
            type="color"
            value={customization.backgroundColor}
            onChange={(e) => handleChange("backgroundColor", e.target.value)}
          />
        </div>

        {/* Logo URL */}
        <div>
          <Label>Logo URL</Label>
          <Input
            value={customization.logoUrl}
            onChange={(e) => handleChange("logoUrl", e.target.value)}
            placeholder="https://yourcdn.com/logo.png"
          />
        </div>

        {/* Include Org Name Toggle */}
        <div className="col-span-2">
          <Label>Include Organization Name</Label>
          <Switch
            checked={customization.includeOrgName}
            onCheckedChange={(val) => handleChange("includeOrgName", val)}
          />
        </div>

        {/* Custom Notes - Rich Text */}
        <div className="col-span-2">
          <Label>Custom Notes</Label>
          {/*<RichTextEditor*/}
          {/*  value={customization.customNotes}*/}
          {/*  onChange={(html) => handleChange("customNotes", html)}*/}
          {/*/>*/}
        </div>

        {/* Shadow */}
        <div>
          <Label>Show Shadow</Label>
          <Switch
            checked={customization.showShadow}
            onCheckedChange={(val) => handleChange("showShadow", val)}
          />
        </div>
        <div>
          <Label>Shadow Color</Label>
          <Input
            type="color"
            value={customization.shadowColor}
            onChange={(e) => handleChange("shadowColor", e.target.value)}
          />
        </div>

        {/* Border */}
        <div>
          <Label>Show Border</Label>
          <Switch
            checked={customization.showBorder}
            onCheckedChange={(val) => handleChange("showBorder", val)}
          />
        </div>
        <div>
          <Label>Border Color</Label>
          <Input
            type="color"
            value={customization.borderColor}
            onChange={(e) => handleChange("borderColor", e.target.value)}
          />
        </div>

        {/* All Text Colors */}
        {[
          ["primaryTextColor", "Primary Text Color"],
          ["linkTextColor", "Link Color"],
          ["errorColor", "Error Text Color"],
          ["inputBorderColor", "Input Border Color"],
          ["inputBorderErrorColor", "Input Border Error Color"],
          ["inputBorderHoverColor", "Input Border Hover Color"],
          ["inputTextColor", "Input Text Color"],
          ["placeholderTextColor", "Placeholder Text Color"],
          ["iconColor", "Icon Color"],
          ["checkboxActiveColor", "Checkbox Active Color"],
          ["checkboxInactiveColor", "Checkbox Inactive Color"],
        ].map(([key, label]) => (
          <div key={key}>
            <Label>{label}</Label>
            <Input
              type="color"
              value={customization[key as keyof typeof customization] as string}
              onChange={(e) => handleChange(key, e.target.value)}
            />
          </div>
        ))}
      </div>
      <div
        className={`border rounded-lg p-4 transition-all duration-300 mt-6 ${
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
    </>
  );
};
