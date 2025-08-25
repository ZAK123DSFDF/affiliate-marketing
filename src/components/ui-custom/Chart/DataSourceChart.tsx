"use client"

import React, { useEffect } from "react"
import { Pie, PieChart } from "recharts"
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
import {
  useDashboardCardCustomizationOption,
  useDashboardThemeCustomizationOption,
  usePieChartCustomizationOption,
} from "@/hooks/useDashboardCustomization"
import { PieChartCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/PieChartCustomization"
import { getShadowWithColor } from "@/util/GetShadowWithColor"
import { toValidShadowSize } from "@/util/ValidateShadowColor"
import {
  AffiliateReferrerStat,
  SellerReferrerStat,
} from "@/lib/types/affiliateReferrerStat"
import { useSearch } from "@/hooks/useSearch"
import { getAffiliateReferrers } from "@/app/affiliate/[orgId]/dashboard/action"
import {
  getSellerKpiStats,
  getSellerReferrer,
} from "@/app/seller/[orgId]/dashboard/action"
import { useQueryFilter } from "@/hooks/useQueryFilter"

const chartConfig: ChartConfig = {
  visitors: { label: "Visitors" },
}

export default function SocialTrafficPieChart({
  orgId,
  referrerStats,
  isPreview = false,
  affiliate = false,
}: {
  orgId: string
  referrerStats?: AffiliateReferrerStat[]
  isPreview?: boolean
  affiliate: boolean
}) {
  const innerRadius = isPreview ? 60 : 100
  const outerRadius = isPreview ? 90 : 140
  const ThemeCustomization = useDashboardThemeCustomizationOption()
  const pieCustomization = usePieChartCustomizationOption()
  const dashboardCard = useDashboardCardCustomizationOption()
  const { filters, setFilters } = useQueryFilter({
    yearKey: "sourceYear",
    monthKey: "sourceMonth",
  })
  const { data: affiliateData, isPending: affiliatePending } = useSearch(
    ["affiliate-source", orgId, filters.year, filters.month],
    getAffiliateReferrers,
    [filters.year, filters.month],
    {
      enabled: !!(
        affiliate &&
        orgId &&
        (filters.year || filters.month) &&
        !isPreview
      ),
    }
  )
  const { data: sellerData, isPending: sellerPending } = useSearch(
    ["seller-source", orgId, filters.year, filters.month],
    getSellerReferrer,
    [orgId, filters.year, filters.month],
    {
      enabled: !!(
        !affiliate &&
        orgId &&
        (filters.year || filters.month) &&
        !isPreview
      ),
    }
  )
  const searchData = affiliate ? affiliateData : sellerData
  const searchPending = affiliate ? affiliatePending : sellerPending
  const effectiveData: AffiliateReferrerStat[] = React.useMemo(() => {
    if (affiliate && searchData) {
      return searchData as AffiliateReferrerStat[]
    }
    if (!affiliate && searchData) {
      return searchData as SellerReferrerStat[]
    }

    return referrerStats || []
  }, [searchData, referrerStats, affiliate])
  useEffect(() => {
    console.log("search data", searchData)
  }, [searchData])
  const chartData = React.useMemo(() => {
    if (!effectiveData || effectiveData.length === 0) return []

    const colorPalette = [
      pieCustomization.pieColor1 || "#ef4444",
      pieCustomization.pieColor2 || "#f97316",
      pieCustomization.pieColor3 || "#8b5cf6",
      pieCustomization.pieColor4 || "#10b981",
      pieCustomization.pieColor5 || "#facc15",
      pieCustomization.pieColor6 || "#ec4899",
      pieCustomization.pieColor7 || "#3b82f6",
      pieCustomization.pieColor8 || "#0ea5e9",
      pieCustomization.pieFallbackColor || "#a855f7",
    ]

    return effectiveData.map((stat, index) => ({
      platform: stat.referrer,
      visitors: stat.clicks,
      fill: colorPalette[index % colorPalette.length],
    }))
  }, [effectiveData, pieCustomization])
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
                dashboardCard.dashboardCardShadowColor
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
            <div className="flex flex-column gap-1 items-center">
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
            value={{ year: filters.year, month: filters.month }}
            onChange={(year, month) => setFilters({ year, month })}
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
        {searchPending &&
        (filters.year !== undefined || filters.month !== undefined) ? (
          <div className="text-sm text-muted-foreground">
            Loading sources...
          </div>
        ) : chartData.length === 0 ? (
          <div className="text-sm text-muted-foreground">No sources found</div>
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
              />
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
