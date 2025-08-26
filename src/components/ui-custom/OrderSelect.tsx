"use client"

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { OrderDir, OrderBy } from "@/lib/types/orderTypes"

interface Props {
  value: { orderBy?: OrderBy; orderDir?: OrderDir }
  onChange: (orderBy?: OrderBy, orderDir?: OrderDir) => void
  affiliate: boolean
  mode?: "default" | "top"
}

export default function OrderSelect({
  value,
  onChange,
  affiliate,
  mode = "default",
}: Props) {
  const isNone = !value.orderBy || value.orderBy === "none"

  // Define all options
  const allOptions: { value: OrderBy | "none"; label: string }[] = [
    { value: "none", label: "None" },
    { value: "sales", label: "Sales" },
    { value: "commission", label: "Commission" },
    { value: "conversionRate", label: "Conversion Rate" },
    { value: "visits", label: "Visits" },
    { value: "commissionPaid", label: "Commission Paid" },
    { value: "commissionUnpaid", label: "Commission Unpaid" },
    { value: "email", label: "Email" },
  ]

  // Filter if mode is "top"
  const filteredOptions =
    mode === "top"
      ? allOptions.filter((o) =>
          ["none", "visits", "sales", "conversionRate"].includes(o.value)
        )
      : allOptions

  return (
    <div className="flex gap-2">
      {/* Order By Select */}
      <Select
        value={value.orderBy ?? "none"}
        onValueChange={(orderBy) => {
          if (orderBy === "none") {
            onChange(undefined, undefined)
          } else {
            onChange(orderBy as OrderBy, value.orderDir ?? "desc")
          }
        }}
      >
        <SelectTrigger affiliate={affiliate} className="w-[140px]">
          <SelectValue placeholder="Order By" />
        </SelectTrigger>
        <SelectContent affiliate={affiliate}>
          {filteredOptions.map((opt) => (
            <SelectItem key={opt.value} affiliate={affiliate} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Order Direction Select */}
      <Select
        value={value.orderDir ?? "desc"}
        onValueChange={(dir) =>
          onChange(value.orderBy ?? "sales", dir as OrderDir)
        }
        disabled={isNone}
      >
        <SelectTrigger affiliate={affiliate} className="w-[100px]">
          <SelectValue placeholder="Direction" />
        </SelectTrigger>
        <SelectContent affiliate={affiliate}>
          <SelectItem affiliate={affiliate} value="asc">
            Ascending
          </SelectItem>
          <SelectItem affiliate={affiliate} value="desc">
            Descending
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
