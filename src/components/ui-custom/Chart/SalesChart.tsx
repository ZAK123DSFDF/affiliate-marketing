"use client"

import React, { useEffect, useState } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import MonthSelect from "@/components/ui-custom/MonthSelect"
import { DashboardThemeCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/DashboardThemeCustomizationOptions"
import { Separator } from "@/components/ui/separator"
import { useChartCustomizationOption } from "@/hooks/useDashboardCustomization"
import { DashboardCustomizationStores } from "@/store/useCustomizationStore"
import { ChartCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/ChartCustomizationOptions"
import { useSearch } from "@/hooks/useSearch"
import { getAffiliateKpiTimeSeries } from "@/app/affiliate/[orgId]/dashboard/action"
import { getSellerKpiTimeSeries } from "@/app/(seller)/seller/[orgId]/dashboard/action"
import { useQueryFilter } from "@/hooks/useQueryFilter"
import { useDashboardCard } from "@/hooks/useDashboardCard"
import { dummyChartData } from "@/lib/types/dummyChartData"

interface ChartDailyMetricsProps {
  orgId: string
  affiliate: boolean
  isPreview?: boolean
}

export function ChartDailyMetrics({
  orgId,
  affiliate = false,
  isPreview = false,
}: ChartDailyMetricsProps) {
  const { filters, setFilters } = useQueryFilter({
    yearKey: "chartYear",
    monthKey: "chartMonth",
  })
  const dashboardCardStyle = useDashboardCard(affiliate)
  const { data: affiliateSearchData, isPending: affiliateSearchPending } =
    useSearch(
      ["affiliate-kpi-time-series", orgId, filters.year, filters.month],
      getAffiliateKpiTimeSeries,
      [orgId, filters.year, filters.month],
      {
        enabled: !!(affiliate && orgId && !isPreview),
      }
    )
  const { data: sellerSearchData, isPending: sellerSearchPending } = useSearch(
    ["seller-kpi-time-series", orgId, filters.year, filters.month],
    getSellerKpiTimeSeries,
    [orgId, filters.year, filters.month],
    {
      enabled: !!(!affiliate && orgId && !isPreview),
    }
  )
  const searchData = affiliate ? affiliateSearchData : sellerSearchData
  const searchPending = affiliate ? affiliateSearchPending : sellerSearchPending
  const [previewLoading, setPreviewLoading] = useState(isPreview)

  useEffect(() => {
    if (isPreview) {
      const timer = setTimeout(() => setPreviewLoading(false), 1500)
      return () => clearTimeout(timer)
    }
  }, [isPreview])
  const data = React.useMemo(() => {
    const source = isPreview ? dummyChartData : (searchData ?? [])
    return source.map((item) => ({
      ...item,
      date: item.createdAt,
      visits: item.visitors,
    }))
  }, [isPreview, searchData])
  const ChartCustomization = useChartCustomizationOption()
  const ThemeCustomization =
    DashboardCustomizationStores.useDashboardThemeCustomization()
  const baseColors: any = {
    visits: (affiliate && ChartCustomization.chartPrimaryColor) || "#60A5FA",
    sales: (affiliate && ChartCustomization.chartSecondaryColor) || "#A78BFA",
    conversionRate:
      (affiliate && ChartCustomization.chartTertiaryColor) || "#5EEAD4",
  }
  const chartConfig: ChartConfig = {
    visits: { label: "Visits", color: "var(--chart-1)" },
    sales: { label: "Sales", color: "var(--chart-2)" },
    conversionRate: {
      label: "Conversion Rate (%)",
      color: "var(--chart-3)",
    },
  }

  const chartKeys = Object.keys(chartConfig)

  return (
    <Card
      className={`${isPreview ? "h-[340px]" : "h-[480px]"} flex flex-col relative`}
      style={dashboardCardStyle}
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
          value={{ year: filters.year, month: filters.month }}
          onChange={(year, month) => setFilters({ year, month })}
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
        {(isPreview && previewLoading) || (!isPreview && searchPending) ? (
          <div className="flex items-center justify-center h-[300px]">
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        ) : (
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
        )}
      </CardContent>
      {isPreview && (
        <div className="absolute bottom-1 left-1 pt-2">
          <ChartCustomizationOptions triggerSize="w-5 h-5" dropdownSize="sm" />
        </div>
      )}
    </Card>
  )
}
