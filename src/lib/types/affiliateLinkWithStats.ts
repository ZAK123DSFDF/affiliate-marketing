export type AffiliateLinkWithStats = {
  id: string;
  fullUrl: string;
  clicks: number;
  sales: number;
  createdAt: Date;
  conversionRate?: number;
};
