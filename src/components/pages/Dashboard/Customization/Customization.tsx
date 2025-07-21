"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CustomizationForm() {
  const [colors, setColors] = useState({
    sidebarBackgroundColor: "#1F2937",
    sidebarTextColor: "#F9FAFB",
    sidebarButtonColor: "#4F46E5",
    sidebarButtonHoverColor: "#6366F1",
    sidebarButtonActiveColor: "#4338CA",
    sidebarProfileHoverColor: "#D97706",
    sidebarProfileActiveColor: "#B45309",
  });

  const handleChange = (key: keyof typeof colors, value: string) => {
    setColors((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(colors).map(([key, value]) => (
        <div key={key} className="space-y-2">
          <Label htmlFor={key}>{key}</Label>
          <Input
            id={key}
            type="color"
            value={value}
            onChange={(e) =>
              handleChange(key as keyof typeof colors, e.target.value)
            }
          />
        </div>
      ))}
    </div>
  );
}
