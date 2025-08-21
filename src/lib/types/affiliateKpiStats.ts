export interface AffiliateKpiStats {
  totalLinks: number;
  totalVisitors: number;
  totalSales: number;
  totalCommission: number;
  totalCommissionPaid: number;
  totalCommissionUnpaid: number;
}
export type SellerKpiStats = AffiliateKpiStats & {
  totalAmount: number;
  totalAffiliates: number;
};
