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
import MonthSelect from "@/components/ui-custom/MonthSelect";

interface ChartDailyMetricsProps {
  affiliate?: boolean;
  isPreview?: boolean;
}

const rawMetricsData = [
  { date: "2024-06-01", visits: 340, sales: 45, amount: 1200, commission: 240 },
  { date: "2024-06-02", visits: 380, sales: 60, amount: 1600, commission: 320 },
  { date: "2024-06-03", visits: 420, sales: 58, amount: 1800, commission: 290 },
  { date: "2024-06-04", visits: 390, sales: 62, amount: 1900, commission: 310 },
  { date: "2024-06-05", visits: 410, sales: 40, amount: 1000, commission: 200 },
  { date: "2024-06-06", visits: 500, sales: 78, amount: 2200, commission: 430 },
  { date: "2024-06-07", visits: 460, sales: 65, amount: 1700, commission: 300 },
];

const baseColors: any = {
  visits: "#60A5FA",
  sales: "#A78BFA",
  conversionRate: "#5EEAD4",
  amount: "#C4B5FD",
  commission: "#F97316", // orange
};

export function ChartDailyMetrics({
  affiliate = false,
  isPreview = false,
}: ChartDailyMetricsProps) {
  const [timeRange, setTimeRange] = React.useState("7d");
  const [selectedDate, setSelectedDate] = React.useState<{
    month?: number;
    year?: number;
  }>({});
  // Transform data
  const data = rawMetricsData.map((item) => ({
    ...item,
    conversionRate: parseFloat(((item.sales / item.visits) * 100).toFixed(2)),
  }));

  // Chart config (dynamic based on affiliate mode)
  const chartConfig: ChartConfig = {
    visits: { label: "Visits", color: "var(--chart-1)" },
    sales: { label: "Sales", color: "var(--chart-2)" },
    conversionRate: {
      label: "Conversion Rate (%)",
      color: "var(--chart-3)",
    },
    ...(affiliate
      ? {
          commission: { label: "Commission ($)", color: "var(--chart-4)" },
        }
      : {
          amount: { label: "Total Amount ($)", color: "var(--chart-4)" },
        }),
  };

  const chartKeys = Object.keys(chartConfig);

  return (
    <Card className={`${isPreview ? "h-[300px]" : "h-[480px]"} flex flex-col`}>
      <CardHeader
        className={`flex items-center gap-2 space-y-0 border-b ${
          isPreview ? "py-2" : "py-5"
        } sm:flex-row`}
      >
        <div className="grid flex-1 gap-1">
          <CardTitle className={isPreview ? "text-sm" : "text-lg"}>
            Daily Metrics
          </CardTitle>
          <CardDescription className={isPreview ? "text-xs" : "text-sm"}>
            Visits, Sales, Conversion Rate, and{" "}
            {affiliate ? "Commission" : "Revenue"}
          </CardDescription>
        </div>
        <MonthSelect
          isPreview={isPreview}
          value={selectedDate}
          onChange={(month, year) => setSelectedDate({ month, year })}
        />
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className={`${
            isPreview ? "h-[180px] max-w-[260px] mx-auto" : "h-[300px] w-full"
          }`}
        >
          <div className={isPreview ? "h-[200px]" : "h-[320px] w-full"}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  {chartKeys.map((key) => (
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
                        stopColor={baseColors[key]}
                        stopOpacity={0.5}
                      />
                      <stop
                        offset="100%"
                        stopColor={baseColors[key]}
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
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
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
                {chartKeys.map((key) => (
                  <Area
                    key={key}
                    dataKey={key}
                    type="monotone"
                    fill={`url(#fill-${key})`}
                    stroke={baseColors[key]}
                    strokeWidth={2}
                  />
                ))}
                <ChartLegend
                  content={<ChartLegendContent isPreview={isPreview} />}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
