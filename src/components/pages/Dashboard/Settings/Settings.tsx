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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Organization Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label>Company Name</label>
              <Input defaultValue={orgData.name} />
            </div>

            <div>
              <label>Domain Name</label>
              <Input defaultValue={orgData.domainName} />
            </div>

            <div>
              <label>Logo URL</label>
              <Input defaultValue={orgData.logoUrl || ""} />
            </div>

            <div>
              <label>Referral Parameter</label>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Cookie Lifetime</label>
                <Input
                  type="number"
                  defaultValue={orgData.cookieLifetimeValue.toString()}
                />
              </div>
              <div>
                <label>Lifetime Unit</label>
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
              <div>
                <label>Commission Type</label>
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
              <div>
                <label>Commission Value</label>
                <Input
                  type="number"
                  step="0.01"
                  defaultValue={orgData.commissionValue}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Commission Duration</label>
                <Input
                  type="number"
                  defaultValue={orgData.commissionDurationValue.toString()}
                />
              </div>
              <div>
                <label>Duration Unit</label>
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

            <div>
              <label>Currency</label>
              <Select
                value={formValues.currency}
                onValueChange={(val: any) =>
                  setFormValues((prev) => ({ ...prev, currency: val }))
                }
              >
                <SelectTrigger>
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

            <Button disabled>Update Settings (coming soon)</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
