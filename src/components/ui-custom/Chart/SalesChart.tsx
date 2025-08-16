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
function generateSampleData(count: number) {
  const data = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    // Go backwards in time day by day
    const date = new Date(today);
    date.setDate(today.getDate() - (count - i));

    // Random visits & sales
    const visits = Math.floor(Math.random() * 500) + 100; // 100 - 600
    const sales = Math.floor(Math.random() * (visits * 0.3)); // up to 30% conversion
    const amount = sales * (Math.floor(Math.random() * 50) + 20); // $20–$70 per sale
    const commission = Math.floor(amount * 0.2); // 20% commission

    data.push({
      date: date.toISOString().split("T")[0],
      visits,
      sales,
      amount,
      commission,
    });
  }

  return data;
}
const rawMetricsData = generateSampleData(1000);

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
                      year: "numeric",
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
                          year: "numeric",
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
