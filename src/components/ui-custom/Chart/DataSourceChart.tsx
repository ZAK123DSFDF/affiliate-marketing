"use client";

import React, { useState } from "react";
import { TrendingUp } from "lucide-react";
import { Pie, PieChart, Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import MonthSelect from "@/components/ui-custom/MonthSelect";

// Dummy data (social platforms)
const chartData = [
  { platform: "X", visitors: 320, fill: "#60a5fa" },
  { platform: "YouTube", visitors: 280, fill: "#ef4444" },
  { platform: "Reddit", visitors: 190, fill: "#f97316" },
  {
    platform: "Instagram",
    visitors: 240,
    fill: "#8b5cf6",
  },
  { platform: "Threads", visitors: 130, fill: "#10b981" },
  { platform: "Google", visitors: 310, fill: "#facc15" },
  { platform: "TikTok", visitors: 220, fill: "#ec4899" },
  { platform: "Facebook", visitors: 260, fill: "#3b82f6" },
];

const chartConfig: ChartConfig = {
  visitors: {
    label: "Visitors",
  },
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const years = [2022, 2023, 2024, 2025];

export default function SocialTrafficCharts() {
  const [selectedDate, setSelectedDate] = useState<{
    month?: number;
    year?: number;
  }>({});

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Social Traffic Insights</CardTitle>
          </div>
          <MonthSelect
            value={selectedDate}
            onChange={(month, year) => setSelectedDate({ month, year })}
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie Chart Box */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Traffic by Platform</CardTitle>
              <CardDescription>Pie (Donut) Chart</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ChartContainer
                config={chartConfig}
                className="aspect-square max-h-[260px] w-full"
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
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Horizontal Bar Chart Box */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Visitor Breakdown</CardTitle>
              <CardDescription>Horizontal Bar Chart</CardDescription>
            </CardHeader>

            <CardContent className="overflow-x-auto px-0">
              {" "}
              {/* Remove default horizontal padding */}
              <ChartContainer config={chartConfig}>
                <BarChart
                  data={chartData}
                  layout="vertical"
                  width={480} // Keep this reasonable
                  height={260}
                  margin={{ top: 0, right: 20, left: -20, bottom: 0 }} // left margin smaller
                >
                  <YAxis
                    dataKey="platform"
                    type="category"
                    tickLine={false}
                    tickMargin={6}
                    axisLine={false}
                    width={100}
                    tick={({ x, y, payload }) => {
                      const label = payload.value as string;
                      const truncated =
                        label.length > 12
                          ? `${label.slice(0, 10).trim()}...`
                          : label;

                      return (
                        <g transform={`translate(${x},${y})`}>
                          <text
                            x={0}
                            y={0}
                            dy={4}
                            textAnchor="end"
                            fontSize={12}
                            fill="currentColor"
                          >
                            {truncated}
                            <title>{label}</title>
                          </text>
                        </g>
                      );
                    }}
                  />
                  <XAxis dataKey="visitors" type="number" hide />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar
                    dataKey="visitors"
                    radius={[5, 5, 0, 0]}
                    fill="#3b82f6"
                    barSize={18}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
