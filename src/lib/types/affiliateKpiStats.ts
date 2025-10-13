export interface AffiliateKpiStats {
  totalLinks: number
  totalVisitors: number
  totalSales: number
  totalCommission: number
  totalCommissionPaid: number
  totalCommissionUnpaid: number
  currency: string
}
export type OrganizationKpiStats = AffiliateKpiStats & {
  totalAmount: number
  totalAffiliates: number
  currency: string
}
