// app/create-company/page.tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"

import { Form } from "@/components/ui/form"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, User } from "lucide-react"
import { CreateOrganization } from "@/app/(seller)/create-company/action"
import { InputField } from "@/components/Auth/FormFields"
import { SelectField } from "@/components/ui-custom/SelectFields"
import { useAuthMutation } from "@/hooks/useAuthMutation"
import { FileUpload } from "@/components/ui-custom/FileUpload"
import { LogoUpload } from "@/components/ui-custom/LogoUpload"

export const companySchema = z.object({
  name: z.string().min(2),
  domainName: z
    .string()
    .min(2)
    .regex(
      /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}|localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/i,
      "Invalid domain format (e.g., 'example.com' or 'localhost')"
    ),
  logoUrl: z.string().url().optional().or(z.literal("")),
  referralParam: z.enum(["ref", "via", "aff"]),
  cookieLifetimeValue: z.coerce.number().min(1),
  cookieLifetimeUnit: z.enum(["day", "week", "month", "year"]),
  commissionType: z.enum(["percentage", "fixed"]),
  commissionValue: z.coerce.number().min(0),
  commissionDurationValue: z.coerce.number().min(1),
  commissionDurationUnit: z.enum(["day", "week", "month", "year"]),
  currency: z.enum(["USD", "EUR", "GBP", "CAD", "AUD"]),
})

type CompanySchema = z.infer<typeof companySchema>
type CreateCompanyProps = {
  mode: "create" | "add"
  embed?: boolean
}
export default function CreateCompany({ mode, embed }: CreateCompanyProps) {
  const form = useForm<CompanySchema>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      domainName: "",
      logoUrl: "",
      referralParam: "ref",
      cookieLifetimeValue: 30,
      cookieLifetimeUnit: "day",
      commissionType: "percentage",
      commissionValue: 10,
      commissionDurationValue: 30,
      commissionDurationUnit: "day",
      currency: "USD",
    },
  })
  const router = useRouter()

  const { mutate, isPending } = useAuthMutation(CreateOrganization, {
    onSuccess: (res: any) => {
      if (res.ok && res.data?.id) {
        router.push(`/seller/${res.data.id}/dashboard/analytics`)
      }
    },
  })

  const onSubmit = (data: CompanySchema) => mutate({ ...data, mode })
  const formContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            control={form.control}
            name="name"
            label="Company Name"
            placeholder="Acme Inc"
            type="text"
            icon={User}
            affiliate={false}
          />
          <InputField
            control={form.control}
            name="domainName"
            label="Company Domain"
            placeholder="yourcompany.com"
            type="text"
            icon={User}
            affiliate={false}
          />
          <LogoUpload
            value={form.watch("logoUrl") || null}
            onChange={(url) => {
              form.setValue("logoUrl", url || "")
            }}
            affiliate={false}
          />

          <SelectField
            control={form.control}
            name="referralParam"
            label="Referral URL Parameter"
            placeholder="Select referral param"
            options={[
              { value: "ref", label: "ref" },
              { value: "via", label: "via" },
              { value: "aff", label: "aff" },
            ]}
            affiliate={false}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InputField
            control={form.control}
            name="cookieLifetimeValue"
            label="Cookie Lifetime"
            type="number"
            placeholder="30"
            icon={User}
            affiliate={false}
          />
          <SelectField
            control={form.control}
            name="cookieLifetimeUnit"
            label="Unit"
            placeholder="Select unit"
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
            placeholder="Select type"
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
            type="number"
            placeholder="10"
            icon={User}
            affiliate={false}
          />
          <InputField
            control={form.control}
            name="commissionDurationValue"
            label="Commission Duration"
            type="number"
            placeholder="30"
            icon={User}
            affiliate={false}
          />
          <SelectField
            control={form.control}
            name="commissionDurationUnit"
            label="Duration Unit"
            placeholder="Select unit"
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
            placeholder="Select currency"
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

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Create Company"
          )}
        </Button>
      </form>
    </Form>
  )

  if (embed) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Create Your Company</h2>
        {formContent}
      </div>
    )
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Create Your Company
            </CardTitle>
          </CardHeader>
          <CardContent>{formContent}</CardContent>
        </Card>
      </div>
    </div>
  )
}
