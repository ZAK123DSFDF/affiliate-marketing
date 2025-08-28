"use client"

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { z } from "zod"

import { updateOrgSettings } from "@/app/seller/[orgId]/dashboard/settings/action"
import { useToast } from "@/hooks/use-toast"
import { orgSettingsSchema } from "@/lib/schema/orgSettingSchema"

type OrgData = z.infer<typeof orgSettingsSchema>
type Props = { orgData: OrgData }

export default function Settings({ orgData }: Props) {
  const { toast } = useToast()
  const form = useForm<OrgData>({
    resolver: zodResolver(orgSettingsSchema),
    defaultValues: orgData,
  })

  const { formState } = form
  const { isDirty } = formState

  const isUnchanged = !isDirty

  const mut = useMutation({
    mutationFn: updateOrgSettings,
    onSuccess: (res) => {
      if (res?.ok) {
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
      </div>

      {/* Settings Form */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Company Name</label>
              <Input {...form.register("name")} />
            </div>

            <div>
              <label className="block text-sm font-medium">Domain Name</label>
              <Input {...form.register("domainName")} />
            </div>

            <div>
              <label className="block text-sm font-medium">
                attribution model
              </label>
              <Select
                value={form.getValues("attributionModel")}
                onValueChange={(val) =>
                  form.setValue(
                    "attributionModel",
                    val as OrgData["attributionModel"]
                  )
                }
              >
                <SelectTrigger affiliate={false}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent affiliate={false}>
                  <SelectItem affiliate={false} value="FIRST_CLICK">
                    first_click
                  </SelectItem>
                  <SelectItem affiliate={false} value="LAST_CLICK">
                    last_click
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium">
                Referral Parameter
              </label>
              <Select
                value={form.getValues("referralParam")}
                onValueChange={(val) =>
                  form.setValue(
                    "referralParam",
                    val as OrgData["referralParam"]
                  )
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
            <div>
              <label className="block text-sm font-medium">
                Cookie Lifetime
              </label>
              <Input type="number" {...form.register("cookieLifetimeValue")} />
            </div>
            <div>
              <label className="block text-sm font-medium">Lifetime Unit</label>
              <Select
                value={form.getValues("cookieLifetimeUnit")}
                onValueChange={(val) =>
                  form.setValue(
                    "cookieLifetimeUnit",
                    val as OrgData["cookieLifetimeUnit"]
                  )
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
            <div>
              <label className="block text-sm font-medium">
                Commission Type
              </label>
              <Select
                value={form.getValues("commissionType")}
                onValueChange={(val) =>
                  form.setValue(
                    "commissionType",
                    val as OrgData["commissionType"]
                  )
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
            <div>
              <label className="block text-sm font-medium">
                Commission Value
              </label>
              <Input
                type="number"
                step="0.01"
                {...form.register("commissionValue")}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">
                Commission Duration
              </label>
              <Input
                type="number"
                {...form.register("commissionDurationValue")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Duration Unit</label>
              <Select
                value={form.getValues("commissionDurationUnit")}
                onValueChange={(val) =>
                  form.setValue(
                    "commissionDurationUnit",
                    val as OrgData["commissionDurationUnit"]
                  )
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

          {/* Currency */}
          <div>
            <label className="block text-sm font-medium">Currency</label>
            <Select
              value={form.getValues("currency")}
              onValueChange={(val) =>
                form.setValue("currency", val as OrgData["currency"])
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
        <CardFooter className="flex justify-end">
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={mut.isPending || isUnchanged}
          >
            {mut.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
