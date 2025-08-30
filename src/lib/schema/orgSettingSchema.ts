import { z } from "zod"

export const orgSettingsSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2),
  domainName: z.string().min(2),
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
})
