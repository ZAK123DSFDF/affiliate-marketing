"use client"

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card"
import deepEqual from "fast-deep-equal"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Loader2, User } from "lucide-react"
import { z } from "zod"

import { updateOrgSettings } from "@/app/seller/[orgId]/dashboard/settings/action"
import { useToast } from "@/hooks/use-toast"
import { orgSettingsSchema } from "@/lib/schema/orgSettingSchema"
import React, { useMemo } from "react"
import { InputField } from "@/components/Auth/FormFields"
import { SelectField } from "@/components/ui-custom/SelectFields"

type OrgData = z.infer<typeof orgSettingsSchema>
type Props = { orgData: OrgData }

export default function Settings({ orgData }: Props) {
  const { toast } = useToast()
  const safeDefaults: OrgData = {
    id: orgData?.id ?? "",
    name: orgData?.name ?? "",
    domainName: orgData?.domainName ?? "",
    logoUrl: orgData?.logoUrl ?? null,
    referralParam: orgData?.referralParam ?? "ref",
    cookieLifetimeValue: orgData?.cookieLifetimeValue ?? "30",
    cookieLifetimeUnit: orgData?.cookieLifetimeUnit ?? "day",
    commissionType: orgData?.commissionType ?? "percentage",
    commissionValue: String(parseFloat(orgData.commissionValue)) ?? "0",
    commissionDurationValue: orgData?.commissionDurationValue ?? "30",
    commissionDurationUnit: orgData?.commissionDurationUnit ?? "day",
    currency: orgData?.currency ?? "USD",
    attributionModel: orgData?.attributionModel ?? "LAST_CLICK",
  }
  const form = useForm<OrgData>({
    resolver: zodResolver(orgSettingsSchema),
    defaultValues: safeDefaults,
  })
  const currentValues = form.watch()
  const isFormUnchanged = useMemo(() => {
    return deepEqual(currentValues, safeDefaults)
  }, [currentValues, safeDefaults])
  const mut = useMutation({
    mutationFn: (data: Partial<OrgData> & { id: string }) =>
      updateOrgSettings(data),
    onSuccess: (res) => {
      if (res?.ok) {
        form.reset(form.getValues())
        toast({ title: "Settings updated", description: "Saved successfully." })
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
    const changed = (Object.keys(data) as (keyof OrgData)[]).reduce(
      (acc, key) => {
        if (!deepEqual(data[key], safeDefaults[key])) {
          acc[key] = data[key] as any
        }
        return acc
      },
      {} as Partial<OrgData>
    )

    if (Object.keys(changed).length === 0) return

    mut.mutate({ id: data.id, ...changed })
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
      </div>

      {/* Settings Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  control={form.control}
                  name="name"
                  label="Company Name"
                  placeholder="Enter your name"
                  type="text"
                  icon={User}
                  affiliate={false}
                />{" "}
                <InputField
                  control={form.control}
                  name="domainName"
                  label="Domain Name"
                  placeholder="Enter your Domain"
                  type="text"
                  icon={User}
                  affiliate={false}
                />
                <SelectField
                  control={form.control}
                  name="attributionModel"
                  label="attribution model"
                  placeholder="attribution model"
                  options={[
                    { value: "FIRST_CLICK", label: "first_click" },
                    { value: "LAST_CLICK", label: "last_click" },
                  ]}
                  affiliate={false}
                />
                <SelectField
                  control={form.control}
                  name="referralParam"
                  label="Referral Parameter"
                  placeholder="Referral Parameter"
                  options={[
                    { value: "ref", label: "ref" },
                    { value: "via", label: "via" },
                    { value: "aff", label: "aff" },
                  ]}
                  affiliate={false}
                />
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
                <InputField
                  control={form.control}
                  name="cookieLifetimeValue"
                  label="Cookie Lifetime"
                  placeholder="Cookie Lifetime"
                  type="number"
                  icon={User}
                  affiliate={false}
                />
                <SelectField
                  control={form.control}
                  name="cookieLifetimeUnit"
                  label="Cookie Lifetime Unit"
                  placeholder="Cookie Lifetime Unit"
                  options={[
                    { value: "day", label: "Day" },
                    { value: "week", label: "Week" },
                    { value: "month", label: "Month" },
                    { value: "year", label: "Year" },
                  ]}
                  affiliate={false}
                />
                <SelectField
                  control={form.control}
                  name="commissionType"
                  label="Commission Type"
                  placeholder="Commission Type"
                  options={[
                    { value: "percentage", label: "Percentage" },
                    { value: "fixed", label: "Fixed" },
                  ]}
                  affiliate={false}
                />
                <InputField
                  control={form.control}
                  name="commissionValue"
                  label="Commission Value"
                  placeholder="Commission Value"
                  type="number"
                  icon={User}
                  affiliate={false}
                />
                <InputField
                  control={form.control}
                  name="commissionDurationValue"
                  label="Commission Duration"
                  placeholder="Commission Duration"
                  type="number"
                  icon={User}
                  affiliate={false}
                />
                <SelectField
                  control={form.control}
                  name="commissionDurationUnit"
                  label="Duration Unit"
                  placeholder="Duration Unit"
                  options={[
                    { value: "day", label: "Day" },
                    { value: "week", label: "Week" },
                    { value: "month", label: "Month" },
                    { value: "year", label: "Year" },
                  ]}
                  affiliate={false}
                />
                <SelectField
                  control={form.control}
                  name="currency"
                  label="Currency"
                  placeholder="Currency"
                  options={[
                    { value: "USD", label: "USD" },
                    { value: "EUR", label: "EUR" },
                    { value: "GBP", label: "GBP" },
                    { value: "CAD", label: "CAD" },
                    { value: "AUD", label: "AUD" },
                  ]}
                  affiliate={false}
                />
              </div>
              <CardFooter className="flex justify-end">
                <Button
                  type="submit"
                  disabled={mut.isPending || isFormUnchanged}
                >
                  {mut.isPending && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </CardFooter>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}
