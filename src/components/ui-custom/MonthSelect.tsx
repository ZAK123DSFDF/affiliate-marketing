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
  value: { month?: number; year?: number };
  onChange: (month?: number, year?: number) => void;
  disabled?: boolean;
  isPreview?: boolean;
  affiliate: boolean;
}

export default function MonthSelect({
  value,
  onChange,
  disabled,
  isPreview = false,
  affiliate,
}: Props) {
  const now = new Date();
  const START_YEAR = 1990;
  const years = Array.from(
    { length: now.getUTCFullYear() - START_YEAR + 1 },
    (_, i) => now.getUTCFullYear() - i,
  );

  return (
    <div className={`flex gap-2 ${isPreview ? "text-xs" : ""}`}>
      {/* Year Select */}
      <Select
        value={value.year ? value.year.toString() : "all"}
        onValueChange={(yearVal) =>
          onChange(
            value.month,
            yearVal === "all" ? undefined : parseInt(yearVal),
          )
        }
        disabled={disabled}
      >
        <SelectTrigger
          affiliate={affiliate}
          className={`${isPreview ? "w-[72px] h-8 px-2 text-xs" : "w-[100px]"}`}
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
            monthVal === "all" ? undefined : parseInt(monthVal),
            value.year,
          )
        }
        disabled={!value.year || disabled}
      >
        <SelectTrigger
          affiliate={affiliate}
          className={`${isPreview ? "w-[72px] h-8 px-2 text-xs" : "w-[100px]"}`}
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
  );
}
