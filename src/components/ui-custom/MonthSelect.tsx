"use client"

import React from "react"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { getResponsiveSelectWidth } from "@/util/GetResponsiveSelectWidth"
import { cn } from "@/lib/utils"

interface Props {
  value: { year?: number; month?: number }
  onChange: (year?: number, month?: number) => void
  disabled?: boolean
  isPreview?: boolean
  affiliate: boolean
}

export default function MonthSelect({
  value,
  onChange,
  disabled,
  isPreview = false,
  affiliate,
}: Props) {
  const now = new Date()
  const START_YEAR = 1990
  const years = Array.from(
    { length: now.getUTCFullYear() - START_YEAR + 1 },
    (_, i) => now.getUTCFullYear() - i
  )
  const widthClasses = getResponsiveSelectWidth(isPreview)
  return (
    <div className={`flex gap-2 ${isPreview ? "text-xs" : ""}`}>
      {/* Year Select */}
      <Select
        value={value.year ? value.year.toString() : "all"}
        onValueChange={(yearVal) =>
          onChange(
            yearVal === "all" ? undefined : parseInt(yearVal),
            value.month // keep month
          )
        }
        disabled={disabled}
      >
        <SelectTrigger
          affiliate={affiliate}
          className={cn(widthClasses)}
          aria-disabled={disabled}
        >
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent affiliate={affiliate}>
          <SelectItem affiliate={affiliate} value="all">
            All
          </SelectItem>
          {years.map((y) => (
            <SelectItem affiliate={affiliate} key={y} value={y.toString()}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Month Select */}
      <Select
        value={value.month ? value.month.toString() : "all"}
        onValueChange={(monthVal) =>
          onChange(
            value.year, // ✅ year first
            monthVal === "all" ? undefined : parseInt(monthVal)
          )
        }
        disabled={!value.year || disabled}
      >
        <SelectTrigger
          affiliate={affiliate}
          className={cn(widthClasses)}
          aria-disabled={!value.year || disabled}
        >
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent affiliate={affiliate}>
          <SelectItem affiliate={affiliate} value="all">
            All
          </SelectItem>
          {Array.from({ length: 12 }, (_, i) => (
            <SelectItem
              affiliate={affiliate}
              key={i + 1}
              value={(i + 1).toString()}
            >
              {new Date(0, i).toLocaleString("default", { month: "short" })}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
