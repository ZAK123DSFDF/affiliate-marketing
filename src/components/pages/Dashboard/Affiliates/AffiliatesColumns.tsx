"use client"

import { ColumnDef } from "@tanstack/react-table"
import { AffiliateStats } from "@/lib/types/affiliateStats"
import { commonAffiliateColumns } from "@/components/ui-custom/CommonColumns"

export const AffiliatesColumns = (): ColumnDef<AffiliateStats>[] => {
  return [
    commonAffiliateColumns.email,
    commonAffiliateColumns.links,
    commonAffiliateColumns.visitors,
    commonAffiliateColumns.sales,
    {
      accessorKey: "conversionRate",
      header: "Conversion Rate",
      cell: ({ row }) => {
        const rate = parseFloat(row.getValue("conversionRate"))
        return <div>{isNaN(rate) ? "-" : `${rate.toFixed(2)}%`}</div>
      },
    },
    commonAffiliateColumns.commission,
    commonAffiliateColumns.paid,
    commonAffiliateColumns.unpaid,
  ]
}
