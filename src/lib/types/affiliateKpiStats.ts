export interface AffiliateKpiStats {
  affiliateId: string;
  name: string;
  email: string;
  totalLinks: number;
  totalVisitors: number;
  totalSales: number;
  totalCommission: number;
  totalCommissionPaid: number;
  totalCommissionUnpaid: number;
}
export type SellerKpiStats = Omit<
  AffiliateKpiStats,
  "affiliateId" | "email" | "name"
> & {
  totalAmount: number;
  totalAffiliates: number;
};
