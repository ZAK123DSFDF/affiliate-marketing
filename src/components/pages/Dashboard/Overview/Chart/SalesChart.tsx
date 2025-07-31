"use client";

import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const dailyMetricsData = [
  { date: "2024-06-01", visits: 340, sales: 45, amount: 1200 },
  { date: "2024-06-02", visits: 380, sales: 60, amount: 1600 },
  { date: "2024-06-03", visits: 420, sales: 58, amount: 1800 },
  { date: "2024-06-04", visits: 390, sales: 62, amount: 1900 },
  { date: "2024-06-05", visits: 410, sales: 40, amount: 1000 },
  { date: "2024-06-06", visits: 500, sales: 78, amount: 2200 },
  { date: "2024-06-07", visits: 460, sales: 65, amount: 1700 },
].map((item) => ({
  ...item,
  conversionRate: parseFloat(((item.sales / item.visits) * 100).toFixed(2)),
}));

const chartColors: any = {
  visits: "#60A5FA",
  sales: "#A78BFA",
  conversionRate: "#5EEAD4",
  amount: "#C4B5FD",
};
const chartConfig = {
  visits: { label: "Visits", color: "var(--chart-1)" },
  sales: { label: "Sales", color: "var(--chart-2)" },
  conversionRate: { label: "Conversion Rate (%)", color: "var(--chart-3)" },
  amount: { label: "Total Amount ($)", color: "var(--chart-4)" },
} satisfies ChartConfig;
export function ChartDailyMetrics() {
  const [timeRange, setTimeRange] = React.useState("7d");

  return (
    <Card className="pt-0 mt-8">
      {" "}
      {/* Add margin to separate from KPI section */}
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Daily Metrics</CardTitle>
          <CardDescription>
            Visits, Sales, Conversion Rate, and Revenue
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex">
            <SelectValue placeholder="Last 7 days" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d">Last 3 months</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyMetricsData}>
                <defs>
                  {Object.keys(chartColors).map((key) => (
                    <linearGradient
                      id={`fill-${key}`}
                      key={key}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={chartColors[key]}
                        stopOpacity={0.5}
                      />
                      <stop
                        offset="100%"
                        stopColor={chartColors[key]}
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  ))}
                </defs>

                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      }
                      indicator="dot"
                    />
                  }
                />
                {Object.keys(chartColors).map((key) => (
                  <Area
                    key={key}
                    dataKey={key}
                    type="monotone"
                    fill={`url(#fill-${key})`}
                    stroke={chartColors[key]}
                    strokeWidth={2}
                  />
                ))}
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
