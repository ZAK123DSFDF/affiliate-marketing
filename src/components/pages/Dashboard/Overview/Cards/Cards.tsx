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

const Cards = () => {
  const [selectedMonth, setSelectedMonth] = useState<string | undefined>();
  const [selectedYear, setSelectedYear] = useState<string | undefined>();
  return (
    <div className="space-y-6">
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
        {initialKpiData.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="shadow-sm p-4 flex-1 min-w-[200px]">
            <CardContent className="flex items-center gap-4 p-2">
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default Cards;
