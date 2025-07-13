import { z } from "zod";
export const orgSettingsSchema = z.object({
  orgId: z.string().min(1),
  name: z.string().min(2),
  domainName: z.string().min(2),
  logoUrl: z.string().url().optional().or(z.literal("")),
  referralParam: z.enum(["ref", "via", "aff"]),
  cookieLifetimeValue: z.coerce.number().min(1),
  cookieLifetimeUnit: z.enum(["day", "week", "month", "year"]),
  commissionType: z.enum(["percentage", "fixed"]),
  commissionValue: z.coerce.number().min(0),
  commissionDurationValue: z.coerce.number().min(1),
  commissionDurationUnit: z.enum(["day", "week", "month", "year"]),
  currency: z.enum(["USD", "EUR", "GBP", "CAD", "AUD"]),
});
