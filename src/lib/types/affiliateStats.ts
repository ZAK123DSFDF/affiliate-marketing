export interface AffiliateStats {
  id: string
  email: string
  visitors: number
  sales: number
  commission: number
  paid: number
  unpaid: number
  links: string[]
  conversionRate: number
  currency: string
}

export type AffiliatePayout = Omit<AffiliateStats, "conversionRate">
