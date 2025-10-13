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
import {
  BadgeDollarSign,
  Building2,
  Calendar,
  Clock,
  Coins,
  Globe,
  Link2,
  Loader2,
  User,
} from "lucide-react"
import { z } from "zod"

import { updateOrgSettings } from "@/app/(seller)/seller/[orgId]/dashboard/settings/action"
import { useToast } from "@/hooks/use-toast"
import { orgSettingsSchema } from "@/lib/schema/orgSettingSchema"
import React, { useMemo } from "react"
import { InputField } from "@/components/Auth/FormFields"
import { SelectField } from "@/components/ui-custom/SelectFields"
import { LogoUpload } from "@/components/ui-custom/LogoUpload"
import { OrgData } from "@/lib/types/organization"

type OrgFormData = z.infer<typeof orgSettingsSchema>
type Props = { orgData: OrgData }

export default function Settings({ orgData }: Props) {
  const { toast } = useToast()
  const safeDefaults: OrgFormData = {
    id: orgData?.id ?? "",
    name: orgData?.name ?? "",
    websiteUrl: orgData?.websiteUrl ?? "",
    logoUrl: orgData?.logoUrl ?? null,
    referralParam: (orgData?.referralParam as "ref" | "via" | "aff") ?? "ref",
    cookieLifetimeValue: String(orgData?.cookieLifetimeValue ?? "30"),
    cookieLifetimeUnit:
      (orgData?.cookieLifetimeUnit as "day" | "week" | "month" | "year") ??
      "day",
    commissionType:
      (orgData?.commissionType as "percentage" | "fixed") ?? "percentage",
    commissionValue: String(Number(orgData.commissionValue ?? 0)),
    commissionDurationValue: String(orgData?.commissionDurationValue ?? "30"),
    commissionDurationUnit:
      (orgData?.commissionDurationUnit as "day" | "week" | "month" | "year") ??
      "day",
    currency:
      (orgData?.currency as "USD" | "EUR" | "GBP" | "CAD" | "AUD") ?? "USD",
    attributionModel:
      (orgData?.attributionModel as "FIRST_CLICK" | "LAST_CLICK") ??
      "LAST_CLICK",
  }

  const form = useForm<OrgFormData>({
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

  const onSubmit = (data: OrgFormData) => {
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
                  icon={Building2}
                  affiliate={false}
                />{" "}
                <InputField
                  control={form.control}
                  name="websiteUrl"
                  label="Website URL"
                  placeholder="Enter your Domain"
                  type="text"
                  icon={Globe}
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
                  icon={Link2}
                  affiliate={false}
                />
                <div className="flex justify-start">
                  <LogoUpload
                    value={form.watch("logoUrl") || null}
                    onChange={(url) => form.setValue("logoUrl", url || "")}
                    affiliate={false}
                    orgId={orgData.id}
                    orgName={orgData.name}
                  />
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
                <InputField
                  control={form.control}
                  name="cookieLifetimeValue"
                  label="Cookie Lifetime"
                  placeholder="Cookie Lifetime"
                  type="number"
                  icon={Clock}
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
                  icon={Calendar}
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
                  icon={Coins}
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
                  icon={Calendar}
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
                  icon={Calendar}
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
                  icon={BadgeDollarSign}
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
