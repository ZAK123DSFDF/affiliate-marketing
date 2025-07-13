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
import { startOfYear } from "date-fns";

interface Props {
  value: { month?: number; year?: number }; // month 1‑12
  onChange: (m?: number, y?: number) => void;
}

export default function MonthSelect({ value, onChange }: Props) {
  const now = new Date();
  const years = Array.from({ length: 5 }, (_, i) => now.getUTCFullYear() - i);

  return (
    <div className="flex gap-2">
      <Select
        value={value.year?.toString()}
        onValueChange={(y) =>
          onChange(value.month, y ? parseInt(y, 10) : undefined)
        }
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All</SelectItem>
          {years.map((y) => (
            <SelectItem key={y} value={y.toString()}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={value.month?.toString()}
        onValueChange={(m) =>
          onChange(m ? parseInt(m, 10) : undefined, value.year)
        }
        disabled={!value.year} // month only selectable when a year is chosen
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All</SelectItem>
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
