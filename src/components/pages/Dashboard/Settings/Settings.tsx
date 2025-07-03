"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar"; // if used

type OrgData = {
  name: string;
  domainName: string;
  logoUrl?: string | null;
  referralParam: "ref" | "via" | "aff";
  cookieLifetimeValue: number;
  cookieLifetimeUnit: "day" | "week" | "month" | "year";
  commissionType: "percentage" | "fixed";
  commissionValue: string;
  commissionDurationValue: number;
  commissionDurationUnit: "day" | "week" | "month" | "year";
  currency: "USD" | "EUR" | "GBP" | "CAD" | "AUD";
};

type Props = {
  orgData: OrgData;
};

export default function Settings({ orgData }: Props) {
  const [formValues, setFormValues] = useState({ ...orgData });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <div>
            <h1 className="text-3xl font-bold">Organization Settings</h1>
            <p className="text-muted-foreground">
              Manage your affiliate setup and configuration
            </p>
          </div>
        </div>
        <Button disabled>Update Settings</Button>
      </div>

      {/* Basic Information Card - Now with side-by-side fields */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Company Name</label>
              <Input defaultValue={orgData.name} />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Domain Name</label>
              <Input defaultValue={orgData.domainName} />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Logo URL</label>
              <Input defaultValue={orgData.logoUrl || ""} />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Referral Parameter
              </label>
              <Select
                value={formValues.referralParam}
                onValueChange={(val: any) =>
                  setFormValues((prev) => ({ ...prev, referralParam: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ref">ref</SelectItem>
                  <SelectItem value="via">via</SelectItem>
                  <SelectItem value="aff">aff</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tracking and Commission Card */}
      <Card>
        <CardHeader>
          <CardTitle>Tracking and Commission</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Cookie Lifetime
              </label>
              <Input
                type="number"
                defaultValue={orgData.cookieLifetimeValue.toString()}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Lifetime Unit</label>
              <Select
                value={formValues.cookieLifetimeUnit}
                onValueChange={(val: any) =>
                  setFormValues((prev) => ({
                    ...prev,
                    cookieLifetimeUnit: val,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Commission Type
              </label>
              <Select
                value={formValues.commissionType}
                onValueChange={(val: any) =>
                  setFormValues((prev) => ({ ...prev, commissionType: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Commission Value
              </label>
              <Input
                type="number"
                step="0.01"
                defaultValue={orgData.commissionValue}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Commission Duration
              </label>
              <Input
                type="number"
                defaultValue={orgData.commissionDurationValue.toString()}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Duration Unit</label>
              <Select
                value={formValues.commissionDurationUnit}
                onValueChange={(val: any) =>
                  setFormValues((prev) => ({
                    ...prev,
                    commissionDurationUnit: val,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Currency Selector - Now with constrained width */}
          <div className="w-full space-y-2">
            <label className="block text-sm font-medium">Currency</label>
            <Select
              value={formValues.currency}
              onValueChange={(val: any) =>
                setFormValues((prev) => ({ ...prev, currency: val }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
                <SelectItem value="CAD">CAD</SelectItem>
                <SelectItem value="AUD">AUD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
