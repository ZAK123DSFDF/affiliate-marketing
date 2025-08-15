import { AffiliateKpiStats } from "@/lib/types/affiliateKpiStats";
import { DollarSign, Link, MousePointer, ShoppingCart } from "lucide-react";

export const mapAffiliateStats = (stats: AffiliateKpiStats) => [
  { label: "Total Links", value: stats.totalLinks, icon: Link },
  { label: "Total Visitors", value: stats.totalVisitors, icon: MousePointer },
  { label: "Total Sales", value: stats.totalSales, icon: ShoppingCart },
  {
    label: "Total Commission",
    value: `$${stats.totalCommission}`,
    icon: DollarSign,
  },
  {
    label: "Paid Commission",
    value: `$${stats.totalCommissionPaid}`,
    icon: DollarSign,
  },
  {
    label: "Unpaid Commission",
    value: `$${stats.totalCommissionUnpaid}`,
    icon: DollarSign,
  },
];
