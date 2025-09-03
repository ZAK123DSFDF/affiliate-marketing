import { AffiliateStats } from "@/lib/types/affiliateStats"

export const dummyAffiliateTopRankData: AffiliateStats[] = [
  {
    id: "1",
    email: "jane.doe@example.com",
    links: ["https://affiliate.com/jane", "https://another.com/jane"],
    visitors: 320,
    sales: 80,
    commission: 480,
    paid: 400,
    unpaid: 80,
    conversionRate: parseFloat(((80 / 320) * 100).toFixed(2)), // 25.00%
    currency: "USD",
  },
  {
    id: "2",
    email: "john.smith@example.com",
    links: ["https://affiliate.com/john"],
    visitors: 500,
    sales: 120,
    commission: 720,
    paid: 600,
    unpaid: 120,
    conversionRate: parseFloat(((120 / 500) * 100).toFixed(2)), // 24.00%
    currency: "USD",
  },
  {
    id: "3",
    email: "sara.lee@example.com",
    links: ["https://affiliate.com/sara", "https://blog.com/sara"],
    visitors: 200,
    sales: 50,
    commission: 300,
    paid: 300,
    unpaid: 0,
    conversionRate: parseFloat(((50 / 200) * 100).toFixed(2)), // 25.00%
    currency: "USD",
  },
  {
    id: "4",
    email: "michael.chan@example.com",
    links: ["https://affiliate.com/michael"],
    visitors: 450,
    sales: 100,
    commission: 600,
    paid: 450,
    unpaid: 150,
    conversionRate: parseFloat(((100 / 450) * 100).toFixed(2)), // 22.22%
    currency: "USD",
  },
  {
    id: "5",
    email: "anna.taylor@example.com",
    links: ["https://affiliate.com/anna"],
    visitors: 150,
    sales: 40,
    commission: 240,
    paid: 180,
    unpaid: 60,
    conversionRate: parseFloat(((40 / 150) * 100).toFixed(2)), // 26.67%
    currency: "USD",
  },
]
