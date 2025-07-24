"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Login from "@/components/pages/Login";
import Signup from "@/components/pages/Signup";
import { ResettableColorInput } from "@/util/ResettableColorInput";

export const AuthCustomization = () => {
  const [customization, setCustomization] = useState({
    backgroundColor: "",
    showShadow: true,
    shadowColor: "",
    borderColor: "",
    showBorder: true,
    includeOrgName: true,
    logoUrl: "",
    cardBackgroundColor: "",

    primaryTextColor: "",
    linkTextColor: "",
    errorColor: "",
    inputBorderColor: "",
    inputBorderErrorColor: "",
    inputBorderFocusColor: "",
    inputTextColor: "",
    placeholderTextColor: "",
    iconColor: "",
    checkboxActiveColor: "",
    checkboxInactiveColor: "",

    customNotes: "<p>Welcome! Please enter your credentials.</p>",
  });

  const handleChange = (key: string, value: string | boolean) => {
    setCustomization((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ResettableColorInput
          label="Background Color"
          value={customization.backgroundColor}
          onChange={(val) => handleChange("backgroundColor", val)}
        />
        <ResettableColorInput
          label="Card Background Color"
          value={customization.cardBackgroundColor}
          onChange={(val) => handleChange("cardBackgroundColor", val)}
        />
        <div>
          <Label>Logo URL</Label>
          <Input
            value={customization.logoUrl}
            onChange={(e) => handleChange("logoUrl", e.target.value)}
            placeholder="https://yourcdn.com/logo.png"
          />
        </div>

        <div className="col-span-2">
          <Label>Include Organization Name</Label>
          <Switch
            checked={customization.includeOrgName}
            onCheckedChange={(val) => handleChange("includeOrgName", val)}
          />
        </div>

        {/* Rich Text Placeholder */}
        <div className="col-span-2">
          <Label>Custom Notes</Label>
          {/* RichTextEditor here */}
        </div>

        <div>
          <Label>Show Shadow</Label>
          <Switch
            checked={customization.showShadow}
            onCheckedChange={(val) => handleChange("showShadow", val)}
          />
        </div>
        <ResettableColorInput
          label="Shadow Color"
          value={customization.shadowColor}
          onChange={(val) => handleChange("shadowColor", val)}
        />

        <div>
          <Label>Show Border</Label>
          <Switch
            checked={customization.showBorder}
            onCheckedChange={(val) => handleChange("showBorder", val)}
          />
        </div>
        <ResettableColorInput
          label="Border Color"
          value={customization.borderColor}
          onChange={(val) => handleChange("borderColor", val)}
        />

        {/* All other colors */}
        {[
          ["primaryTextColor", "Primary Text Color"],
          ["linkTextColor", "Link Color"],
          ["errorColor", "Error Text Color"],
          ["inputBorderColor", "Input Border Color"],
          ["inputBorderErrorColor", "Input Border Error Color"],
          ["inputBorderFocusColor", "Input Border Focus Color"],
          ["inputTextColor", "Input Text Color"],
          ["placeholderTextColor", "Placeholder Text Color"],
          ["iconColor", "Icon Color"],
          ["checkboxActiveColor", "Checkbox Active Color"],
          ["checkboxInactiveColor", "Checkbox Inactive Color"],
        ].map(([key, label]) => (
          <ResettableColorInput
            key={key}
            label={label}
            value={customization[key as keyof typeof customization] as string}
            onChange={(val) => handleChange(key, val)}
          />
        ))}
      </div>

      <div className="border rounded-lg p-4 transition-all duration-300 mt-6 shadow-md">
        <Tabs defaultValue="login">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Signup</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Login customization={customization} />
          </TabsContent>
          <TabsContent value="signup">
            <Signup customization={customization} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
