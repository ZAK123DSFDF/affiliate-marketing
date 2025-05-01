// app/dashboard/settings/page.tsx
"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Settings() {
  const [commissionType, setCommissionType] = React.useState("percentage");
  const [commissionDuration, setCommissionDuration] =
    React.useState("lifetime");

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <div>
            <h1 className="text-3xl font-bold">Project Settings</h1>
            <p className="text-muted-foreground">
              Configure your project parameters
            </p>
          </div>
        </div>
        <Button>Save Settings</Button>
      </div>

      {/* Main Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle>Project Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name</Label>
            <Input id="projectName" placeholder="Enter your project name" />
          </div>

          {/* Logo Upload */}
          <div className="space-y-2">
            <Label>Project Logo</Label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                {/* Placeholder for logo */}
                <span className="text-gray-400">Logo</span>
              </div>
              <Input id="logo" type="file" className="max-w-sm" />
            </div>
          </div>

          {/* Referral Parameter */}
          <div className="space-y-2">
            <Label htmlFor="referralParam">Referral Parameter</Label>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select parameter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ref">ref</SelectItem>
                <SelectItem value="via">via</SelectItem>
                <SelectItem value="aff">aff</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Cookie Lifetime */}
          <div className="space-y-2">
            <Label htmlFor="cookieLifetime">Cookie Lifetime</Label>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select days" />
              </SelectTrigger>
              <SelectContent>
                {[7, 14, 30, 60, 90, 180, 365].map((days) => (
                  <SelectItem key={days} value={days.toString()}>
                    {days} days
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Commission Type */}
          <div className="space-y-2">
            <Label>Commission Type</Label>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="percentage"
                  name="commissionType"
                  value="percentage"
                  checked={commissionType === "percentage"}
                  onChange={() => setCommissionType("percentage")}
                  className="h-4 w-4 text-primary focus:ring-primary"
                />
                <Label htmlFor="percentage">Percentage</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="fixed"
                  name="commissionType"
                  value="fixed"
                  checked={commissionType === "fixed"}
                  onChange={() => setCommissionType("fixed")}
                  className="h-4 w-4 text-primary focus:ring-primary"
                />
                <Label htmlFor="fixed">Fixed Amount</Label>
              </div>
            </div>
          </div>

          {/* Commission Value */}
          <div className="space-y-2">
            <Label htmlFor="commissionValue">
              {commissionType === "percentage"
                ? "Percentage Value"
                : "Fixed Amount"}
            </Label>
            <div className="flex gap-2 items-center">
              <Input
                id="commissionValue"
                type="number"
                placeholder={commissionType === "percentage" ? "10" : "5.00"}
              />
              {commissionType === "percentage" && <span>%</span>}
            </div>
          </div>

          {/* Commission Duration */}
          <div className="space-y-2">
            <Label>Commission Duration</Label>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="lifetime"
                  name="commissionDuration"
                  value="lifetime"
                  checked={commissionDuration === "lifetime"}
                  onChange={() => setCommissionDuration("lifetime")}
                  className="h-4 w-4 text-primary focus:ring-primary"
                />
                <Label htmlFor="lifetime">Lifetime</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="fixedPeriod"
                  name="commissionDuration"
                  value="fixedPeriod"
                  checked={commissionDuration === "fixedPeriod"}
                  onChange={() => setCommissionDuration("fixedPeriod")}
                  className="h-4 w-4 text-primary focus:ring-primary"
                />
                <Label htmlFor="fixedPeriod">Fixed Period</Label>
              </div>
            </div>
          </div>

          {/* Fixed Period Duration (conditionally shown) */}
          {commissionDuration === "fixedPeriod" && (
            <div className="space-y-2">
              <Label htmlFor="periodMonths">Duration (months)</Label>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select months" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 3, 6, 12, 24].map((months) => (
                    <SelectItem key={months} value={months.toString()}>
                      {months} {months === 1 ? "month" : "months"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end border-t pt-6">
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
