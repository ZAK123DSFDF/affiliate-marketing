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
import { DashboardThemeCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/DashboardThemeCustomizationOptions";
import { Separator } from "@/components/ui/separator";
import {
  useChartCustomizationOption,
  useDashboardCardCustomizationOption,
} from "@/hooks/useDashboardCustomization";
import { DashboardCustomizationStores } from "@/store/useCustomizationStore";
import { ChartCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/ChartCustomizationOptions";
import { getShadowWithColor } from "@/util/GetShadowWithColor";
import { toValidShadowSize } from "@/util/ValidateShadowColor";

interface ChartDailyMetricsProps {
  affiliate: boolean;
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

export function ChartDailyMetrics({
  affiliate = false,
  isPreview = false,
}: ChartDailyMetricsProps) {
  const [selectedDate, setSelectedDate] = React.useState<{
    month?: number;
    year?: number;
  }>({});
  const ChartCustomization = useChartCustomizationOption();
  const ThemeCustomization =
    DashboardCustomizationStores.useDashboardThemeCustomization();
  const dashboardCard = useDashboardCardCustomizationOption();
  const baseColors: any = {
    visits: (affiliate && ChartCustomization.chartPrimaryColor) || "#60A5FA",
    sales: (affiliate && ChartCustomization.chartSecondaryColor) || "#A78BFA",
    conversionRate:
      (affiliate && ChartCustomization.chartTertiaryColor) || "#5EEAD4",
    amount: "#C4B5FD",
    commission: (affiliate && ChartCustomization.chartFourthColor) || "#F97316",
  };
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
    <Card
      className={`${isPreview ? "h-[340px]" : "h-[480px]"} flex flex-col relative`}
      style={{
        backgroundColor:
          (affiliate && dashboardCard.dashboardCardBackgroundColor) ||
          undefined,
        boxShadow:
          affiliate &&
          dashboardCard.dashboardCardShadow &&
          dashboardCard.dashboardCardShadow !== "none"
            ? affiliate &&
              getShadowWithColor(
                toValidShadowSize(dashboardCard.dashboardCardShadowThickness),
                dashboardCard.dashboardCardShadowColor,
              )
            : "",
        border:
          affiliate && dashboardCard.dashboardCardBorder
            ? `1px solid ${affiliate && dashboardCard.dashboardCardBorderColor}`
            : "none",
      }}
    >
      <CardHeader
        className={`flex items-center gap-2 space-y-0 ${isPreview ? "py-2" : "py-5"} sm:flex-row`}
      >
        <div className="grid flex-1 gap-1">
          <div className="flex flex-row gap-1 items-center">
            <CardTitle
              className={isPreview ? "text-sm" : "text-lg"}
              style={{
                color:
                  (affiliate &&
                    ThemeCustomization.cardHeaderPrimaryTextColor) ||
                  undefined,
              }}
            >
              Daily Metrics
            </CardTitle>
          </div>
          <div className="flex flex-row items-center">
            <CardDescription
              className={isPreview ? "text-xs" : "text-sm"}
              style={{
                color:
                  (affiliate &&
                    ThemeCustomization.cardHeaderDescriptionTextColor) ||
                  undefined,
              }}
            >
              Visits, Sales, Conversion Rate, and{" "}
              {affiliate ? "Commission" : "Revenue"}
            </CardDescription>
          </div>
        </div>
        <MonthSelect
          isPreview={isPreview}
          value={selectedDate}
          onChange={(month, year) => setSelectedDate({ month, year })}
          affiliate={affiliate}
        />
      </CardHeader>

      <Separator
        style={{
          backgroundColor:
            (affiliate && ThemeCustomization.separatorColor) || undefined,
        }}
      />
      {isPreview && (
        <div className="flex justify-end px-4 pt-2">
          <DashboardThemeCustomizationOptions
            name="separatorColor"
            buttonSize="w-4 h-4"
          />
        </div>
      )}
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
                <CartesianGrid
                  vertical={false}
                  stroke={
                    (affiliate &&
                      ChartCustomization.chartHorizontalLineColor) ||
                    "#E5E7EB"
                  }
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tick={{
                    style: {
                      fill:
                        (affiliate && ChartCustomization.chartDateColor) ||
                        "#6B7280",
                    },
                  }}
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
                      affiliate={affiliate}
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
                  content={
                    <ChartLegendContent
                      affiliate={affiliate}
                      isPreview={isPreview}
                    />
                  }
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </CardContent>
      {isPreview && (
        <div className="absolute bottom-1 left-1 pt-2">
          <ChartCustomizationOptions triggerSize="w-5 h-5" dropdownSize="sm" />
        </div>
      )}
    </Card>
  );
}
