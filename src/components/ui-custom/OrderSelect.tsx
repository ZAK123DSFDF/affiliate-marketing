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
}

export default function OrderSelect({ value, onChange, affiliate }: Props) {
  const isNone = !value.orderBy || value.orderBy === "none"
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
          <SelectItem affiliate={affiliate} value="none">
            None
          </SelectItem>
          <SelectItem affiliate={affiliate} value="sales">
            Sales
          </SelectItem>
          <SelectItem affiliate={affiliate} value="commission">
            Commission
          </SelectItem>
          <SelectItem affiliate={affiliate} value="conversionRate">
            Conversion Rate
          </SelectItem>
          <SelectItem affiliate={affiliate} value="visits">
            Visits
          </SelectItem>
          <SelectItem affiliate={affiliate} value="commissionPaid">
            Commission Paid
          </SelectItem>
          <SelectItem affiliate={affiliate} value="commissionUnpaid">
            Commission Unpaid
          </SelectItem>
          <SelectItem affiliate={affiliate} value="email">
            Email
          </SelectItem>
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
