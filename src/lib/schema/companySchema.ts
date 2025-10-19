import { z } from "zod"
import { hostnameSchema, subdomainSchema } from "@/lib/schema/domainSchema"

const domainRegex =
  /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}|localhost|\d{1,3}(?:\.\d{1,3}){3}$/i
export const companySchema = (
  domainType: "platform" | "custom-main" | "custom-subdomain" | null
) => {
  return z
    .object({
      name: z.string().min(2),
      websiteUrl: z
        .string()
        .min(2)
        .regex(
          domainRegex,
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
      defaultDomain: z.union([subdomainSchema, hostnameSchema]),
    })
    .refine(() => domainType === null || domainType === "platform", {
      message:
        "Custom domains and subdomains are not allowed during company creation. Please configure them in Settings after creation.",
      path: ["defaultDomain"],
    })
}

export type CompanyFormValues = z.infer<ReturnType<typeof companySchema>>
