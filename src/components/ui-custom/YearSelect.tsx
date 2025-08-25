"use client"

import React from "react"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

interface Props {
  value: { year?: number }
  onChange: (year?: number) => void
  disabled?: boolean
  affiliate: boolean
  allowAll?: boolean
}

export default function YearSelect({
  value,
  onChange,
  disabled,
  affiliate,
  allowAll = true,
}: Props) {
  const now = new Date()
  const START_YEAR = 1990
  const years = Array.from(
    { length: now.getUTCFullYear() - START_YEAR + 1 },
    (_, i) => now.getUTCFullYear() - i
  )
  const currentSelectedValue =
    value.year?.toString() ??
    (allowAll ? "all" : now.getUTCFullYear().toString())
  return (
    <div className="flex gap-2">
      <Select
        value={currentSelectedValue}
        onValueChange={(yearVal) =>
          onChange(yearVal === "all" ? undefined : parseInt(yearVal))
        }
        disabled={disabled}
      >
        <SelectTrigger
          affiliate={affiliate}
          className="w-[100px]"
          aria-disabled={disabled}
        >
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent affiliate={affiliate}>
          {allowAll && (
            <SelectItem
              affiliate={affiliate}
              value="all"
              selectedValue={currentSelectedValue}
            >
              All
            </SelectItem>
          )}
          {years.map((y) => (
            <SelectItem
              affiliate={affiliate}
              key={y}
              value={y.toString()}
              selectedValue={currentSelectedValue}
            >
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
