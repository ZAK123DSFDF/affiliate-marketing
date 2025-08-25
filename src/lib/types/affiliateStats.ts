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
}

export type AffiliatePayout = Omit<AffiliateStats, "conversionRate">
