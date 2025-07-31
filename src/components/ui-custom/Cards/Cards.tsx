import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { initialKpiData, months, years } from "@/lib/types/dummyKpiData";
import { Card, CardContent } from "@/components/ui/card";

interface CardsProps {
  affiliate?: boolean;
}
const Cards = ({ affiliate = false }: CardsProps) => {
  const [selectedMonth, setSelectedMonth] = useState<string | undefined>();
  const [selectedYear, setSelectedYear] = useState<string | undefined>();
  const filteredData = affiliate
    ? initialKpiData.filter(
        (item) =>
          item.label !== "Total Affiliates" && item.label !== "Total Amount",
      )
    : initialKpiData;
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-6 pt-6">
          {/* Filters */}
          <div className="flex gap-4 flex-wrap">
            <Select onValueChange={setSelectedMonth} value={selectedMonth}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={setSelectedYear} value={selectedYear}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredData.map(({ label, value, icon: Icon, color, bg }) => (
              <div
                key={label}
                className="p-4 border rounded-lg shadow-sm flex items-center gap-4"
              >
                <div className={`p-3 rounded-xl ${bg} flex-shrink-0`}>
                  <Icon className={`w-8 h-8 ${color}`} />
                </div>
                <div className="space-y-1 overflow-hidden">
                  <div className="text-sm text-muted-foreground font-medium truncate">
                    {label}
                  </div>
                  <div className="text-xl font-bold leading-tight truncate">
                    {value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default Cards;
