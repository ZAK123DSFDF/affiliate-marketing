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
  value: { year?: number };
  onChange: (year?: number) => void;
  disabled?: boolean;
}

export default function YearSelect({ value, onChange, disabled }: Props) {
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
          onChange(yearVal === "all" ? undefined : parseInt(yearVal))
        }
        disabled={disabled}
      >
        <SelectTrigger className="w-[100px]" aria-disabled={disabled}>
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
    </div>
  );
}
