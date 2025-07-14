// components/ui-custom/MonthSelect.tsx
"use client";

import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Props {
  value: { month?: number; year?: number }; // month 1‑12
  onChange: (month?: number, year?: number) => void;
}

export default function MonthSelect({ value, onChange }: Props) {
  const now = new Date();
  const START_YEAR = 1990;
  const years = Array.from(
    { length: now.getUTCFullYear() - START_YEAR + 1 },
    (_, i) => now.getUTCFullYear() - i,
  );

  return (
    <div className="flex gap-2">
      {/* Year Select */}
      <Select
        value={value.year ? value.year.toString() : "all"}
        onValueChange={(yearVal) =>
          onChange(
            value.month,
            yearVal === "all" ? undefined : parseInt(yearVal),
          )
        }
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {years.map((y) => (
            <SelectItem key={y} value={y.toString()}>
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
            monthVal === "all" ? undefined : parseInt(monthVal),
            value.year,
          )
        }
        disabled={!value.year}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {Array.from({ length: 12 }, (_, i) => (
            <SelectItem key={i + 1} value={(i + 1).toString()}>
              {new Date(0, i).toLocaleString("default", { month: "short" })}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
