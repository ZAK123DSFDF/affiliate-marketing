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
import { DashboardThemeCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/DashboardThemeCustomizationOptions";
import { Separator } from "@/components/ui/separator";
import {
  useDashboardCardCustomizationOption,
  useDashboardThemeCustomizationOption,
  usePieChartCustomizationOption,
} from "@/hooks/useDashboardCustomization";
import { PieChartCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/PieChartCustomization";
import { getShadowWithColor } from "@/util/GetShadowWithColor";
import { toValidShadowSize } from "@/util/ValidateShadowColor";
import { defaultDashboardCustomization } from "@/customization/Dashboard/defaultDashboardCustomization";
import { useCustomizationSync } from "@/hooks/useCustomizationSync";

const chartConfig: ChartConfig = {
  visitors: { label: "Visitors" },
};

export default function SocialTrafficPieChart({
  isPreview = false,
  affiliate = false,
}: {
  isPreview?: boolean;
  affiliate: boolean;
}) {
  const [selectedDate, setSelectedDate] = useState<{
    month?: number;
    year?: number;
  }>({});
  const innerRadius = isPreview ? 60 : 100;
  const outerRadius = isPreview ? 90 : 140;
  const ThemeCustomization = useDashboardThemeCustomizationOption();
  const pieCustomization = usePieChartCustomizationOption();
  const dashboardCard = useDashboardCardCustomizationOption();

  const chartData = [
    {
      platform: "YouTube",
      visitors: 280,
      fill: (affiliate && pieCustomization.pieColor1) || "#ef4444",
    },
    {
      platform: "Reddit",
      visitors: 190,
      fill: (affiliate && pieCustomization.pieColor2) || "#f97316",
    },
    {
      platform: "Instagram",
      visitors: 240,
      fill: (affiliate && pieCustomization.pieColor3) || "#8b5cf6",
    },
    {
      platform: "Threads",
      visitors: 130,
      fill: (affiliate && pieCustomization.pieColor4) || "#10b981",
    },
    {
      platform: "Google",
      visitors: 310,
      fill: (affiliate && pieCustomization.pieColor5) || "#facc15",
    },
    {
      platform: "TikTok",
      visitors: 220,
      fill: (affiliate && pieCustomization.pieColor6) || "#ec4899",
    },
    {
      platform: "Facebook",
      visitors: 260,
      fill: (affiliate && pieCustomization.pieColor7) || "#3b82f6",
    },
    {
      platform: "Twitter",
      visitors: 260,
      fill: (affiliate && pieCustomization.pieColor8) || "#0ea5e9",
    },
    {
      platform: "Yandex",
      visitors: 260,
      fill: (affiliate && pieCustomization.pieFallbackColor) || "#a855f7",
    },
  ];
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
            ? getShadowWithColor(
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
                Social Traffic
              </CardTitle>
              {isPreview && (
                <DashboardThemeCustomizationOptions
                  name="cardHeaderPrimaryTextColor"
                  buttonSize="w-4 h-4"
                />
              )}
            </div>
            <div className="flex flex-row gap-1 items-center">
              <CardDescription
                className={isPreview ? "text-xs" : "text-sm"}
                style={{
                  color:
                    (affiliate &&
                      ThemeCustomization.cardHeaderDescriptionTextColor) ||
                    undefined,
                }}
              >
                Pie (Donut) Chart
              </CardDescription>
              {isPreview && (
                <DashboardThemeCustomizationOptions
                  name="cardHeaderDescriptionTextColor"
                  buttonSize="w-4 h-4"
                />
              )}
            </div>
          </div>
          <MonthSelect
            isPreview={isPreview}
            value={selectedDate}
            onChange={(month, year) => setSelectedDate({ month, year })}
            affiliate={affiliate}
          />
        </div>
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
              content={<ChartTooltipContent affiliate={affiliate} hideLabel />}
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
      {isPreview && (
        <div className="absolute bottom-1 left-1 pt-2">
          <PieChartCustomizationOptions
            triggerSize="w-5 h-5"
            dropdownSize="sm"
          />
        </div>
      )}
    </Card>
  );
}
