"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"

import { Form } from "@/components/ui/form"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BadgeDollarSign,
  Building2,
  Calendar,
  Clock,
  Coins,
  Globe,
  Link2,
  Loader2,
  Percent,
} from "lucide-react"
import { CreateOrganization } from "@/app/(organization)/(auth)/create-company/action"
import { InputField } from "@/components/Auth/FormFields"
import { SelectField } from "@/components/ui-custom/SelectFields"
import { useAuthMutation } from "@/hooks/useAuthMutation"
import { LogoUpload } from "@/components/ui-custom/LogoUpload"
import { DomainInputField } from "@/components/ui-custom/DomainInputField"
import { useMemo, useState } from "react"
import { CompanyFormValues, companySchema } from "@/lib/schema/companySchema"

type CreateCompanyProps = {
  mode: "create" | "add"
  embed?: boolean
}
const CreateCompany = ({ mode, embed }: CreateCompanyProps) => {
  const [domainType, setDomainType] = useState<
    "platform" | "custom-main" | "custom-subdomain" | null
  >(null)

  const createCompanySchema = useMemo(
    () => companySchema(domainType),
    [domainType]
  )
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      name: "",
      websiteUrl: "",
      logoUrl: "",
      referralParam: "ref",
      cookieLifetimeValue: 30,
      cookieLifetimeUnit: "day",
      commissionType: "percentage",
      commissionValue: 10,
      commissionDurationValue: 30,
      commissionDurationUnit: "day",
      currency: "USD",
      defaultDomain: "",
    },
  })
  const commissionType = form.watch("commissionType")
  const router = useRouter()

  const { mutate, isPending } = useAuthMutation(CreateOrganization, {
    onSuccess: (res: any) => {
      if (res.ok && res.data?.id) {
        router.push(`/organization/${res.data.id}/dashboard/analytics`)
      }
    },
  })

  const onSubmit = (data: CompanyFormValues) => {
    let domain = data.defaultDomain.trim().toLowerCase()
    if (!domain.includes(".") && !domain.endsWith(".refearnapp.com")) {
      domain = `${domain}.refearnapp.com`
    }
    mutate({ ...data, defaultDomain: domain, mode })
  }
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
            icon={Building2}
            affiliate={false}
          />
          <InputField
            control={form.control}
            name="websiteUrl"
            label="Website URL"
            placeholder="example.com"
            type="text"
            icon={Globe}
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
            icon={Link2}
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
            icon={Clock}
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
            icon={Calendar}
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
            icon={Coins}
            affiliate={false}
          />
          <InputField
            control={form.control}
            name="commissionValue"
            label="Commission Value"
            type="number"
            placeholder="10"
            icon={commissionType === "percentage" ? Percent : BadgeDollarSign}
            affiliate={false}
          />
          <InputField
            control={form.control}
            name="commissionDurationValue"
            label="Commission Duration"
            type="number"
            placeholder="30"
            icon={Calendar}
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
            icon={Calendar}
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
            icon={BadgeDollarSign}
            affiliate={false}
          />
        </div>
        <DomainInputField
          control={form.control}
          form={form}
          onDomainTypeChange={setDomainType}
        />
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
export default CreateCompany
