"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Login from "@/components/pages/Login";
import Signup from "@/components/pages/Signup";
import { ResettableColorInput } from "@/components/ui-custom/ResettableColorInput";
import { RichTextEditor } from "@/components/ui-custom/RichTextEditor";
import { AuthCustomizationSettings } from "@/lib/types/authCustomizationSettings";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ForgotPassword from "@/components/pages/Forgot-password";
import ResetPassword from "@/components/pages/Reset-password";
import InvalidToken from "@/components/pages/InvalidToken";

export const AuthCustomization = () => {
  const [customization, setCustomization] = useState<AuthCustomizationSettings>(
    {
      backgroundColor: "",
      showShadow: true,
      shadowColor: "",
      shadowThickness: "lg",
      borderColor: "",
      showBorder: true,
      includeOrgName: true,
      logoUrl: "",
      cardBackgroundColor: "",

      primaryTextColor: "",
      linkTextColor: "",
      secondaryTextColor: "",
      tertiaryTextColor: "",
      errorColor: "",
      inputBorderColor: "",
      inputBorderErrorColor: "",
      inputBorderFocusColor: "",
      inputTextColor: "",
      placeholderTextColor: "",
      iconColor: "",
      toastBackgroundColor: "",
      toastTextColor: "",
      toastSecondaryTextColor: "",
      toastErrorBackgroundColor: "",
      toastErrorTextColor: "",
      toastErrorSecondaryTextColor: "",
      buttonBackgroundColor: "",
      buttonTextColor: "",
      buttonDisabledBackgroundColor: "",
      buttonDisabledTextColor: "",
      checkboxActiveColor: "",
      checkboxInactiveColor: "",

      customNotes: "",
    },
  );

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
        <div className="space-y-1">
          <Label>Shadow Thickness</Label>
          <Select
            value={customization.shadowThickness}
            onValueChange={(val) => handleChange("shadowThickness", val)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select shadow thickness" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="md">Medium</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
              <SelectItem value="xl">Extra Large</SelectItem>
            </SelectContent>
          </Select>
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
          <RichTextEditor
            content={customization.customNotes}
            onChange={(val) => handleChange("customNotes", val)}
          />
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
          ["secondaryTextColor", "Secondary Text Color"],
          ["tertiaryTextColor", "Tertiary Text Color"],
          ["errorColor", "Error Text Color"],
          ["inputBorderColor", "Input Border Color"],
          ["inputBorderErrorColor", "Input Border Error Color"],
          ["inputBorderFocusColor", "Input Border Focus Color"],
          ["inputTextColor", "Input Text Color"],
          ["placeholderTextColor", "Placeholder Text Color"],
          ["iconColor", "Icon Color"],
          ["toastBackgroundColor", "Toast Background Color"],
          ["toastTextColor", "Toast Text Color"],
          ["toastSecondaryTextColor", "Toast Secondary Text Color"],
          ["toastErrorBackgroundColor", "Toast Error Background Color"],
          ["toastErrorTextColor", "Toast Error Text Color"],
          ["toastErrorSecondaryTextColor", "Toast Error Secondary Text Color"],
          ["buttonBackgroundColor", "Button Background Color"],
          ["buttonTextColor", "Button Text Color"],
          ["buttonDisabledBackgroundColor", "Button Disabled Background Color"],
          ["buttonDisabledTextColor", "Button Disabled Text Color"],
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
          <TabsList className="flex flex-wrap gap-2 mb-4 overflow-x-auto whitespace-nowrap">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Signup</TabsTrigger>
            <TabsTrigger value="forgot-password">Forgot Password</TabsTrigger>
            <TabsTrigger value="reset-password">Reset Password</TabsTrigger>
            <TabsTrigger value="invalid-token">Invalid Token</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Login customization={customization} isPreview />
          </TabsContent>
          <TabsContent value="signup">
            <Signup customization={customization} isPreview />
          </TabsContent>
          <TabsContent value="forgot-password">
            <ForgotPassword customization={customization} isPreview />
          </TabsContent>
          <TabsContent value="reset-password">
            <ResetPassword customization={customization} isPreview />
          </TabsContent>
          <TabsContent value="invalid-token">
            <InvalidToken customization={customization} isPreview />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
