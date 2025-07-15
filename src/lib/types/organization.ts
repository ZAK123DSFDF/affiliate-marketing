// types/organization.ts
export interface OrgData {
  id: string;
  name: string;
  domainName: string;
  logoUrl: string | null;
  referralParam: "ref" | "via" | "aff";
  cookieLifetimeValue: number;
  cookieLifetimeUnit: "day" | "week" | "month" | "year";
  commissionType: "fixed" | "percentage";
  commissionValue: string;
  commissionDurationValue: number;
  commissionDurationUnit: "day" | "week" | "month" | "year";
  currency: "USD" | "EUR" | "GBP" | "CAD" | "AUD";
  createdAt: Date;
  updatedAt: Date;
}
