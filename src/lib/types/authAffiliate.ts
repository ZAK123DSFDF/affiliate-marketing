import { affiliate } from "@/db/schema"

export type SafeAffiliateData = Omit<
  typeof affiliate.$inferSelect,
  "password"
> & {
  paypalEmail: string | null
}
export type SafeAffiliateWithCapabilities = SafeAffiliateData & {
  canChangeEmail: boolean
  canChangePassword: boolean
}
