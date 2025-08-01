"use client";

import React, { useState } from "react";
import { Pie, PieChart } from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import MonthSelect from "@/components/ui-custom/MonthSelect";

// Sample data
const chartData = [
  { platform: "YouTube", visitors: 280, fill: "#ef4444" },
  { platform: "Reddit", visitors: 190, fill: "#f97316" },
  { platform: "Instagram", visitors: 240, fill: "#8b5cf6" },
  { platform: "Threads", visitors: 130, fill: "#10b981" },
  { platform: "Google", visitors: 310, fill: "#facc15" },
  { platform: "TikTok", visitors: 220, fill: "#ec4899" },
  { platform: "Facebook", visitors: 260, fill: "#3b82f6" },
];

const chartConfig: ChartConfig = {
  visitors: { label: "Visitors" },
};

export default function SocialTrafficPieChart({
  isPreview = false,
}: {
  isPreview?: boolean;
}) {
  const [selectedDate, setSelectedDate] = useState<{
    month?: number;
    year?: number;
  }>({});
  const innerRadius = isPreview ? 60 : 100;
  const outerRadius = isPreview ? 90 : 140;
  return (
    <Card className={`${isPreview ? "h-[300px]" : "h-[480px]"} flex flex-col`}>
      <CardHeader
        className={`flex items-center gap-2 space-y-0 border-b ${
          isPreview ? "py-2" : "py-5"
        } sm:flex-row`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="grid flex-1 gap-1">
            <CardTitle className={isPreview ? "text-sm" : "text-lg"}>
              Social Traffic Insights
            </CardTitle>
            <CardDescription className={isPreview ? "text-xs" : "text-sm"}>
              Pie (Donut) Chart
            </CardDescription>
          </div>
          <MonthSelect
            isPreview={isPreview}
            value={selectedDate}
            onChange={(month, year) => setSelectedDate({ month, year })}
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex justify-center items-center">
        <ChartContainer
          config={chartConfig}
          className={`aspect-square ${
            isPreview ? "max-w-[200px]" : "max-w-[320px]"
          } w-full`}
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="platform"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={3}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
