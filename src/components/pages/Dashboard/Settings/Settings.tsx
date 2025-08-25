"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useMutation } from "@tanstack/react-query"
import { updateOrgSettings } from "@/app/seller/[orgId]/dashboard/settings/action"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react" // if used

type OrgData = {
  id: string
  name: string
  domainName: string
  logoUrl?: string | null
  referralParam: "ref" | "via" | "aff"
  cookieLifetimeValue: number
  cookieLifetimeUnit: "day" | "week" | "month" | "year"
  commissionType: "percentage" | "fixed"
  commissionValue: string
  commissionDurationValue: number
  commissionDurationUnit: "day" | "week" | "month" | "year"
  currency: "USD" | "EUR" | "GBP" | "CAD" | "AUD"
}

type Props = {
  orgData: OrgData
}
export default function Settings({ orgData }: Props) {
  const [formValues, setFormValues] = useState({
    ...orgData,
    orgId: orgData.id,
  })
  const { toast } = useToast()
  const mut = useMutation({
    mutationFn: updateOrgSettings,
    onSuccess: (res) => {
      if (res?.ok) {
        toast({
          title: "Settings updated",
          description: "Organization settings saved.",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Update failed.",
        })
      }
    },
    onError: () =>
      toast({
        variant: "destructive",
        title: "Unexpected error",
        description: "Please try again",
      }),
  })
  const onSubmit = (data: OrgData) => {
    mut.mutate(data)
  }
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
        <Button onClick={() => onSubmit(formValues)} disabled={mut.isPending}>
          {mut.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Update Settings
        </Button>
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
              <Input
                defaultValue={orgData.name}
                onChange={(e) =>
                  setFormValues((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Domain Name</label>
              <Input
                defaultValue={orgData.domainName}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    domainName: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Logo URL</label>
              <Input
                defaultValue={orgData.logoUrl || ""}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    logoUrl: e.target.value,
                  }))
                }
              />
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
                <SelectTrigger affiliate={false}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent affiliate={false}>
                  <SelectItem affiliate={false} value="ref">
                    ref
                  </SelectItem>
                  <SelectItem affiliate={false} value="via">
                    via
                  </SelectItem>
                  <SelectItem affiliate={false} value="aff">
                    aff
                  </SelectItem>
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
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    cookieLifetimeValue: parseInt(e.target.value, 10),
                  }))
                }
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
                <SelectTrigger affiliate={false}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent affiliate={false}>
                  <SelectItem affiliate={false} value="day">
                    Day
                  </SelectItem>
                  <SelectItem affiliate={false} value="week">
                    Week
                  </SelectItem>
                  <SelectItem affiliate={false} value="month">
                    Month
                  </SelectItem>
                  <SelectItem affiliate={false} value="year">
                    Year
                  </SelectItem>
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
                <SelectTrigger affiliate={false}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent affiliate={false}>
                  <SelectItem affiliate={false} value="percentage">
                    Percentage
                  </SelectItem>
                  <SelectItem affiliate={false} value="fixed">
                    Fixed
                  </SelectItem>
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
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    commissionValue: parseFloat(e.target.value).toFixed(2),
                  }))
                }
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
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    commissionDurationValue: parseInt(e.target.value, 10),
                  }))
                }
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
                <SelectTrigger affiliate={false}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent affiliate={false}>
                  <SelectItem affiliate={false} value="day">
                    Day
                  </SelectItem>
                  <SelectItem affiliate={false} value="week">
                    Week
                  </SelectItem>
                  <SelectItem affiliate={false} value="month">
                    Month
                  </SelectItem>
                  <SelectItem affiliate={false} value="year">
                    Year
                  </SelectItem>
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
              <SelectTrigger affiliate={false} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent affiliate={false}>
                <SelectItem affiliate={false} value="USD">
                  USD
                </SelectItem>
                <SelectItem affiliate={false} value="EUR">
                  EUR
                </SelectItem>
                <SelectItem affiliate={false} value="GBP">
                  GBP
                </SelectItem>
                <SelectItem affiliate={false} value="CAD">
                  CAD
                </SelectItem>
                <SelectItem affiliate={false} value="AUD">
                  AUD
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
