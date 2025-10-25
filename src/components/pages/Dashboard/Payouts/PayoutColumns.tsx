"use client"

import { ColumnDef } from "@tanstack/react-table"
import { AffiliatePayout } from "@/lib/types/affiliateStats"
import { commonAffiliateColumns } from "@/components/ui-custom/CommonColumns"

export const PayoutColumns = (): ColumnDef<AffiliatePayout>[] => {
  return [
    commonAffiliateColumns.email,
    {
      accessorKey: "paypalEmail",
      header: "PayPal Email",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("paypalEmail") || "-"}</div>
      ),
    },
    commonAffiliateColumns.links,
    commonAffiliateColumns.visitors,
    commonAffiliateColumns.sales,
    commonAffiliateColumns.commission,
    commonAffiliateColumns.paid,
    commonAffiliateColumns.unpaid,
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const unpaid = row.original.unpaid
        const status = unpaid > 0 ? "pending" : "paid"
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              status === "paid"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {status}
          </span>
        )
      },
    },
  ]
}
