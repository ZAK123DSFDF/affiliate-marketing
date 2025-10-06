"use client"

import React, { useEffect, useState } from "react"
import { Label, Pie, PieChart } from "recharts"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart"
import MonthSelect from "@/components/ui-custom/MonthSelect"
import { DashboardThemeCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/DashboardThemeCustomizationOptions"
import { Separator } from "@/components/ui/separator"
import { PieChartCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/PieChartCustomizationOptions"
import {
  AffiliateReferrerStat,
  SellerReferrerStat,
} from "@/lib/types/affiliateReferrerStat"
import { useSearch } from "@/hooks/useSearch"
import { getAffiliateReferrers } from "@/app/affiliate/[orgId]/dashboard/action"
import { getSellerReferrer } from "@/app/(seller)/seller/[orgId]/dashboard/action"
import { useQueryFilter } from "@/hooks/useQueryFilter"
import { useDashboardCard } from "@/hooks/useDashboardCard"
import { dummySourceData } from "@/lib/types/dummySourceData"
import { useAtomValue } from "jotai"
import {
  dashboardThemeCustomizationAtom,
  pieChartColorCustomizationAtom,
} from "@/store/DashboardCustomizationAtom"

const chartConfig: ChartConfig = {
  visitors: { label: "Visitors" },
}

export default function SocialTrafficPieChart({
  orgId,
  isPreview = false,
  affiliate = false,
}: {
  orgId: string
  isPreview?: boolean
  affiliate: boolean
}) {
  const innerRadius = isPreview ? 60 : 100
  const outerRadius = isPreview ? 90 : 140
  const {
    cardHeaderDescriptionTextColor,
    cardHeaderPrimaryTextColor,
    separatorColor,
  } = useAtomValue(dashboardThemeCustomizationAtom)
  const dashboardCardStyle = useDashboardCard(affiliate)
  const {
    pieFallbackColor,
    pieColor2,
    pieColor3,
    pieColor4,
    pieColor5,
    pieColor6,
    pieColor7,
    pieColor8,
    pieColor1,
    pieChartLoadingColor,
    pieChartEmptyTextColor,
  } = useAtomValue(pieChartColorCustomizationAtom)
  const { filters, setFilters } = useQueryFilter({
    yearKey: "sourceYear",
    monthKey: "sourceMonth",
  })
  const { data: affiliateData, isPending: affiliatePending } = useSearch(
    ["affiliate-source", orgId, filters.year, filters.month],
    getAffiliateReferrers,
    [orgId, filters.year, filters.month],
    {
      enabled: !!(affiliate && orgId && !isPreview),
    }
  )
  const { data: sellerData, isPending: sellerPending } = useSearch(
    ["seller-source", orgId, filters.year, filters.month],
    getSellerReferrer,
    [orgId, filters.year, filters.month],
    {
      enabled: !!(!affiliate && orgId && !isPreview),
    }
  )
  const [previewLoading, setPreviewLoading] = useState(isPreview)

  useEffect(() => {
    if (isPreview) {
      const timer = setTimeout(() => setPreviewLoading(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [isPreview])
  const searchData = affiliate ? affiliateData : sellerData
  const searchPending = affiliate ? affiliatePending : sellerPending
  const effectiveData = React.useMemo(() => {
    if (isPreview) {
      return dummySourceData
    }

    if (affiliate && searchData) return searchData as AffiliateReferrerStat[]
    if (!affiliate && searchData) return searchData as SellerReferrerStat[]
    return []
  }, [isPreview, searchData, affiliate])
  const chartData = React.useMemo(() => {
    if (!effectiveData || effectiveData.length === 0) return []

    const colorPalette = [
      pieColor1 || "#ef4444",
      pieColor2 || "#f97316",
      pieColor3 || "#8b5cf6",
      pieColor4 || "#10b981",
      pieColor5 || "#facc15",
      pieColor6 || "#ec4899",
      pieColor7 || "#3b82f6",
      pieColor8 || "#0ea5e9",
      pieFallbackColor || "#a855f7",
    ]

    return effectiveData.map((stat, index) => ({
      platform: stat.referrer,
      visitors: stat.clicks,
      fill: colorPalette[index % colorPalette.length],
    }))
  }, [effectiveData])
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
  }, [chartData])
  return (
    <Card
      className={`${isPreview ? "h-[340px]" : "h-[480px]"} flex flex-col relative`}
      style={dashboardCardStyle}
    >
      <CardHeader
        className={`flex items-center gap-2 space-y-0 ${
          isPreview ? "py-2" : "py-5"
        } sm:flex-row`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
          {/* Title + Description */}
          <div className="grid gap-1">
            {/* Proper spacing for Social Traffic */}
            <div className="flex flex-row gap-2 items-center">
              <CardTitle
                className={isPreview ? "text-sm" : "text-lg"}
                style={{
                  color: (affiliate && cardHeaderPrimaryTextColor) || undefined,
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
            <div className="flex flex-row gap-2 items-center">
              <CardDescription
                className={isPreview ? "text-xs" : "text-sm"}
                style={{
                  color:
                    (affiliate && cardHeaderDescriptionTextColor) || undefined,
                }}
              >
                Visitor Source
              </CardDescription>
              {isPreview && (
                <DashboardThemeCustomizationOptions
                  name="cardHeaderDescriptionTextColor"
                  buttonSize="w-4 h-4"
                />
              )}
            </div>
          </div>

          {/* Month + Year select aligned to the right */}
          <div className="flex flex-row gap-2 items-center">
            <MonthSelect
              isPreview={isPreview}
              value={{ year: filters.year, month: filters.month }}
              onChange={(year, month) => setFilters({ year, month })}
              affiliate={affiliate}
            />
          </div>
        </div>
      </CardHeader>
      <Separator
        style={{
          backgroundColor: (affiliate && separatorColor) || undefined,
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
        {(searchPending && !isPreview) || (isPreview && previewLoading) ? (
          <div className="flex flex-col items-center justify-center h-[200px] gap-2">
            <svg
              className="animate-spin h-5 w-5"
              viewBox="0 0 24 24"
              style={{
                color: (affiliate && pieChartLoadingColor) || "#6B7280",
              }}
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <span
              className="text-sm"
              style={{
                color: (affiliate && pieChartLoadingColor) || "#6B7280",
              }}
            >
              Loading sources...
            </span>
          </div>
        ) : chartData.length === 0 ? (
          <div
            className="text-sm text-muted-foreground"
            style={{
              color: (affiliate && pieChartEmptyTextColor) || "#6B7280",
            }}
          >
            No sources found
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className={`aspect-square ${
              isPreview ? "max-w-[200px]" : "max-w-[320px]"
            } w-full`}
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent affiliate={affiliate} hideLabel />
                }
              />
              <Pie
                data={chartData}
                dataKey="visitors"
                nameKey="platform"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                paddingAngle={3}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-blue-600 dark:fill-blue-400 text-3xl font-extrabold"
                          >
                            {totalVisitors.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 20}
                            className="fill-gray-500 dark:fill-gray-400 text-base font-medium"
                          >
                            Visitors
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
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
  )
}
