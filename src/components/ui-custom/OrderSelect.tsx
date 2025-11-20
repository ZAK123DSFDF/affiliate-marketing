"use client"

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { OrderDir, OrderBy } from "@/lib/types/orderTypes"
import { cn } from "@/lib/utils"
import {
  ArrowDown,
  ArrowDownUp,
  ArrowUp,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"

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
  const activeDir = value.orderDir ?? undefined

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
  const cycleDirection = () => {
    if (!activeDir) {
      onChange(value.orderBy, "asc")
    } else if (activeDir === "asc") {
      onChange(value.orderBy, "desc")
    } else {
      onChange(value.orderBy, undefined)
    }
  }
  return (
    <div className="flex gap-2">
      {/* Order By Select */}
      <Select
        value={value.orderBy ?? "none"}
        onValueChange={(orderBy) => {
          if (orderBy === "none") {
            onChange(undefined, undefined)
          } else {
            onChange(orderBy as OrderBy, undefined)
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

      <Button
        variant={activeDir ? "default" : "outline"}
        size="icon"
        disabled={isNone}
        onClick={cycleDirection}
        className={cn(
          "p-0 h-9 w-9 flex items-center justify-center",
          isNone && "opacity-50 cursor-not-allowed"
        )}
      >
        {!activeDir && (
          <div className="flex flex-col items-center justify-center -space-y-1.5 text-muted-foreground">
            <ArrowDownUp className="h-3.5 w-3.5" />
          </div>
        )}
        {activeDir === "asc" && <ArrowUp className="h-3.5 w-3.5" />}
        {activeDir === "desc" && <ArrowDown className="h-3.5 w-3.5" />}
      </Button>
    </div>
  )
}
