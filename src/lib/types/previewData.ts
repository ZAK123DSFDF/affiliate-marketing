import { AffiliateLinkWithStats } from "@/lib/types/affiliateLinkWithStats"
import { AffiliatePaymentRow } from "@/lib/types/affiliatePaymentRow"
import { DummyAffiliateLink } from "@/lib/types/DummyAffiliateLink"

export const dummyAffiliateLinksRaw: DummyAffiliateLink[] = [
  {
    id: "link1",
    fullUrl: "https://example.com/ref/john123",
    createdAt: new Date(),
    clicks: [
      { createdAt: new Date("2025-08-01"), count: 5 },
      { createdAt: new Date("2025-08-05"), count: 10 },
    ],
    sales: [
      { createdAt: new Date("2025-08-01"), count: 1 },
      { createdAt: new Date("2025-08-05"), count: 3 },
    ],
  },
  {
    id: "link2",
    fullUrl: "https://example.com/ref/jane456",
    createdAt: new Date(),
    clicks: [
      { createdAt: new Date("2025-08-02"), count: 3 },
      { createdAt: new Date("2025-08-03"), count: 2 },
    ],
    sales: [{ createdAt: new Date("2025-08-02"), count: 1 }],
  },
]
export const dummyAffiliateLinks: AffiliateLinkWithStats[] =
  dummyAffiliateLinksRaw.map((link) => {
    const totalClicks = link.clicks.reduce((sum, c) => sum + c.count, 0)
    const totalSales = link.sales.reduce((sum, s) => sum + s.count, 0)
    return {
      id: link.id,
      fullUrl: link.fullUrl,
      createdAt: link.createdAt,
      clicks: totalClicks,
      sales: totalSales,
      conversionRate: parseFloat(((totalSales / totalClicks) * 100).toFixed(2)),
    }
  })
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
  {
    month: "2025-08",
    totalCommission: 300.0,
    paidCommission: 200.0,
    unpaidCommission: 0.0,
  },
]
export const dummyProfileData = {
  id: "demo-profile-id",
  name: "Preview User",
  email: "preview.user@example.com",
  paypalEmail: "preview.paypal@gmail.com",
}
