"use client"

import { LinksDialog } from "@/components/ui-custom/LinksDialog"

// 💰 Helper to format currency safely
const formatCurrency = (value: any, currency: string = "USD") => {
  const amount = parseFloat(value)
  if (isNaN(amount)) return "-"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount)
}

// 📦 Common columns shared between affiliate & payout tables
export const commonAffiliateColumns = {
  email: {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }: any) => (
      <div className="lowercase">{row.getValue("email")}</div>
    ),
  },
  links: {
    id: "links",
    header: "Links",
    cell: ({ row }: any) => (
      <LinksDialog
        links={row.original.links}
        title="Affiliate Links"
        description="All links created by this affiliate."
      />
    ),
  },
  visitors: {
    accessorKey: "visitors",
    header: "Visitors",
    cell: ({ row }: any) => <div>{row.getValue("visitors")}</div>,
  },
  sales: {
    accessorKey: "sales",
    header: "Sales",
    cell: ({ row }: any) => <div>{row.getValue("sales")}</div>,
  },
  commission: {
    accessorKey: "commission",
    header: () => <div className="text-right">Commission</div>,
    cell: ({ row }: any) => {
      const currency = row.original.currency || "USD"
      return (
        <div className="text-right font-medium">
          {formatCurrency(row.getValue("commission"), currency)}
        </div>
      )
    },
  },
  paid: {
    accessorKey: "paid",
    header: () => <div className="text-right">Paid</div>,
    cell: ({ row }: any) => {
      const currency = row.original.currency || "USD"
      return (
        <div className="text-right font-medium">
          {formatCurrency(row.getValue("paid"), currency)}
        </div>
      )
    },
  },
  unpaid: {
    accessorKey: "unpaid",
    header: () => <div className="text-right">Unpaid</div>,
    cell: ({ row }: any) => {
      const currency = row.original.currency || "USD"
      return (
        <div className="text-right font-medium">
          {formatCurrency(row.getValue("unpaid"), currency)}
        </div>
      )
    },
  },
}
