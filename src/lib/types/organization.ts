// types/organization.ts
export interface OrgData {
  id: string
  name: string
  domainName: string
  logoUrl: string | null
  referralParam: "ref" | "via" | "aff"
  cookieLifetimeValue: string
  cookieLifetimeUnit: "day" | "week" | "month" | "year"
  commissionType: "fixed" | "percentage"
  commissionValue: string
  commissionDurationValue: string
  commissionDurationUnit: "day" | "week" | "month" | "year"
  currency: "USD" | "EUR" | "GBP" | "CAD" | "AUD"
  attributionModel: "FIRST_CLICK" | "LAST_CLICK"
}
