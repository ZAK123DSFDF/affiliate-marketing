import { z } from "zod"

export const subdomainSchema = z
  .string()
  .min(2, "Subdomain must be at least 2 characters long")
  .regex(
    /^[a-z0-9-]+$/,
    "Subdomain can only contain lowercase letters, numbers, and hyphens"
  )

export const hostnameSchema = z
  .string()
  .min(2)
  .refine((raw) => {
    const v = raw
      .trim()
      .replace(/^https?:\/\//i, "")
      .replace(/\/.*$/, "")
      .toLowerCase()

    if (v.length > 253) return false
    const labels = v.split(".")
    if (labels.length < 2) return false

    for (const lbl of labels) {
      if (!/^[a-z0-9-]{1,63}$/.test(lbl)) return false
      if (lbl.startsWith("-") || lbl.endsWith("-")) return false
    }

    const last = labels[labels.length - 1]
    if (!/^[a-z]{2,63}$/.test(last) && last.length < 2) return false

    return true
  }, "Invalid hostname or domain")
  // 🚫 Add extra refine for multi-level refearnapp.com
  .refine((raw) => {
    const v = raw
      .trim()
      .replace(/^https?:\/\//i, "")
      .replace(/\/.*$/, "")
      .toLowerCase()

    const parts = v.split(".")
    const isRefearnDomain =
      v === "refearnapp.com" || v.endsWith(".refearnapp.com")

    // Allow refearnapp.com itself
    if (v === "refearnapp.com") return true

    // Allow only one subdomain before refearnapp.com
    if (isRefearnDomain) {
      return parts.length === 3 // e.g., shipfast.refearnapp.com ✅
    }

    return true // For custom domains
  }, "Invalid subdomain: only one level allowed before refearnapp.com (e.g., shipfast.refearnapp.com)")

export const orgSettingsSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2),
  websiteUrl: z.string().min(2),
  logoUrl: z.string().nullable(),
  referralParam: z.enum(["ref", "via", "aff"]),
  cookieLifetimeValue: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid amount"),
  cookieLifetimeUnit: z.enum(["day", "week", "month", "year"]),
  commissionType: z.enum(["percentage", "fixed"]),
  commissionValue: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid amount"),
  commissionDurationValue: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid amount"),
  commissionDurationUnit: z.enum(["day", "week", "month", "year"]),
  currency: z.enum(["USD", "EUR", "GBP", "CAD", "AUD"]),
  attributionModel: z.enum(["FIRST_CLICK", "LAST_CLICK"]),
  defaultDomain: z.union([subdomainSchema, hostnameSchema]),
})
