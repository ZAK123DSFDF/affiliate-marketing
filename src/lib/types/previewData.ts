import { AffiliateLinkWithStats } from "@/lib/types/affiliateLinkWithStats";
import { AffiliatePaymentRow } from "@/lib/types/affiliatePaymentRow";

export const dummyAffiliateLinks: AffiliateLinkWithStats[] = [
  {
    id: "link1",
    fullUrl: "https://example.com/ref/john123",
    clicks: 120,
    sales: 15,
    createdAt: new Date(),
  },
  {
    id: "link2",
    fullUrl: "https://example.com/ref/jane456",
    clicks: 80,
    sales: 9,
    createdAt: new Date(),
  },
];

export const dummyAffiliatePayments: AffiliatePaymentRow[] = [
  {
    month: "2025-06",
    totalCommission: 200.0,
    paidCommission: 150.0,
    unpaidCommission: 50.0,
  },
  {
    month: "2025-07",
    totalCommission: 300.0,
    paidCommission: 200.0,
    unpaidCommission: 100.0,
  },
];
