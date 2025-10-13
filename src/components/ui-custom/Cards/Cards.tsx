"use client"

import { Card, CardContent, CardTitle } from "@/components/ui/card"
import MonthSelect from "@/components/ui-custom/MonthSelect"
import {
  dummyAffiliateKpiCardStats,
  initialKpiData,
} from "@/lib/types/dummyKpiData"
import React, { useEffect, useState } from "react"
import { DashboardThemeCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/DashboardThemeCustomizationOptions"
import { YearSelectCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/YearSelectCustomizationOptions"
import { DashboardCardCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/DashboardCardCustomizationOptions"
import { cn } from "@/lib/utils"
import { KpiCardCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/KpiCardCustomizationOptions"
import {
  AffiliateKpiStats,
  SellerKpiStats,
} from "@/lib/types/affiliateKpiStats"
import { mapAffiliateStats, mapSellerStats } from "@/util/mapStats"
import { useSearch } from "@/hooks/useSearch"
import { getAffiliateKpiStats } from "@/app/affiliate/[orgId]/dashboard/action"
import { getSellerKpiStats } from "@/app/(organization)/seller/[orgId]/dashboard/action"
import { useQueryFilter } from "@/hooks/useQueryFilter"
import { useDashboardCard } from "@/hooks/useDashboardCard"
import { formatValue } from "@/util/FormatValue"
import { useAtomValue } from "jotai"
import {
  dashboardThemeCustomizationAtom,
  kpiCardCustomizationAtom,
} from "@/store/DashboardCustomizationAtom"

interface CardsProps {
  orgId: string
  affiliate: boolean
  isPreview?: boolean
}

const affiliateColorPairs = [
  { iconBg: "bg-blue-100", iconColor: "text-blue-600" },
  { iconBg: "bg-green-100", iconColor: "text-green-600" },
  { iconBg: "bg-purple-100", iconColor: "text-purple-600" },
]

const sellerColorPairs = [
  { iconBg: "bg-blue-100", iconColor: "text-blue-600" },
  { iconBg: "bg-green-100", iconColor: "text-green-600" },
  { iconBg: "bg-purple-100", iconColor: "text-purple-600" },
  { iconBg: "bg-yellow-100", iconColor: "text-yellow-600" },
]

const Cards = ({ orgId, affiliate = false, isPreview = false }: CardsProps) => {
  const { cardHeaderPrimaryTextColor } = useAtomValue(
    dashboardThemeCustomizationAtom
  )
  const dashboardCardStyle = useDashboardCard(affiliate)
  const kpiCard = useAtomValue(kpiCardCustomizationAtom)
  const { filters, setFilters } = useQueryFilter({
    yearKey: "kpiYear",
    monthKey: "kpiMonth",
  })

  const { data: affiliateSearchData, isPending: affiliateSearchPending } =
    useSearch(
      ["affiliate-card", orgId, filters.year, filters.month],
      getAffiliateKpiStats,
      [orgId, filters.year, filters.month],
      {
        enabled: !!(affiliate && orgId && !isPreview),
      }
    )
  const { data: sellerSearchData, isPending: sellerSearchPending } = useSearch(
    ["seller-card", orgId, filters.year, filters.month],
    getSellerKpiStats,
    [orgId, filters.year, filters.month],
    {
      enabled: !!(!affiliate && orgId && !isPreview),
    }
  )
  const searchData = affiliate ? affiliateSearchData : sellerSearchData
  const searchPending = affiliate ? affiliateSearchPending : sellerSearchPending
  const filteredData = affiliate
    ? affiliateSearchData?.[0]
      ? mapAffiliateStats(affiliateSearchData[0] as AffiliateKpiStats)
      : initialKpiData
    : sellerSearchData?.[0]
      ? mapSellerStats(sellerSearchData[0] as SellerKpiStats)
      : initialKpiData

  const isFiltering = !!(filters.year || filters.month)
  const [previewLoading, setPreviewLoading] = useState(isPreview)
  useEffect(() => {
    if (isPreview) {
      const timer = setTimeout(() => setPreviewLoading(false), 1500)
      return () => clearTimeout(timer)
    }
  }, [isPreview])
  const displayData = React.useMemo(() => {
    if (isPreview) {
      return mapAffiliateStats(dummyAffiliateKpiCardStats[0]) || initialKpiData
    }

    if (isFiltering) {
      if (searchPending) return []
      if (searchData)
        return affiliate
          ? mapAffiliateStats(searchData[0] as AffiliateKpiStats)
          : mapSellerStats(searchData[0] as SellerKpiStats) || initialKpiData
    }

    return filteredData
  }, [isPreview, isFiltering, searchPending, searchData, filteredData])
  const colorTypes = ["Primary", "Secondary", "Tertiary"] as const
  const colorPairs = affiliate ? affiliateColorPairs : sellerColorPairs

  return (
    <div className="space-y-6">
      <Card
        className={cn(isPreview && "mt-2", "relative")}
        style={dashboardCardStyle}
      >
        {isPreview && affiliate && (
          <div className="absolute bottom-0 left-0 p-2">
            <DashboardCardCustomizationOptions
              triggerSize="w-6 h-6"
              dropdownSize="w-[150px]"
            />
          </div>
        )}
        {isPreview && affiliate && (
          <div className="absolute bottom-0 right-0 p-2">
            <KpiCardCustomizationOptions
              triggerSize="w-6 h-6"
              dropdownSize="w-[180px]"
            />
          </div>
        )}

        <CardContent className={cn("space-y-6 pt-6", isPreview && "pb-10")}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <CardTitle
              style={{
                color: (affiliate && cardHeaderPrimaryTextColor) || undefined,
              }}
              className="text-lg"
            >
              <div className="flex flex-row items-center gap-2">
                <h2 className="text-lg font-semibold">Performance Overview</h2>
                {isPreview && (
                  <DashboardThemeCustomizationOptions
                    name="cardHeaderPrimaryTextColor"
                    buttonSize="w-4 h-4"
                  />
                )}
              </div>
            </CardTitle>
            <div className="flex flex-row gap-2 items-center">
              {isPreview && (
                <YearSelectCustomizationOptions triggerSize="w-6 h-6" />
              )}
              <MonthSelect
                value={{ year: filters.year, month: filters.month }}
                onChange={(year, month) => setFilters({ year, month })}
                affiliate={affiliate}
              />
            </div>
          </div>

          <div
            className={`grid ${
              isPreview
                ? "grid-cols-2 sm:grid-cols-3 gap-2"
                : affiliate
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            }`}
          >
            {(isPreview && previewLoading) || (!isPreview && searchPending)
              ? Array.from({ length: affiliate ? 3 : 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse p-3 rounded-lg bg-gray-100 h-20"
                    style={{
                      backgroundColor:
                        (affiliate && kpiCard.kpiLoadingColor) ||
                        "rgb(243 244 246)",
                    }}
                  />
                ))
              : displayData.map(({ label, value, icon: Icon }, index) => {
                  const colorIndex = index % colorPairs.length
                  const defaultColorPair = colorPairs[colorIndex]

                  if (!affiliate) {
                    return (
                      <div
                        key={label}
                        className={cn(
                          "p-3 flex items-center gap-4 rounded-lg bg-white border shadow-sm",
                          isPreview ? "text-sm" : "text-base"
                        )}
                      >
                        <div
                          className={cn(
                            "flex-shrink-0 rounded-xl flex items-center justify-center",
                            isPreview ? "w-8 h-8" : "p-3",
                            defaultColorPair.iconBg
                          )}
                        >
                          <Icon
                            className={cn(
                              isPreview ? "w-4 h-4" : "w-8 h-8",
                              defaultColorPair.iconColor
                            )}
                          />
                        </div>
                        <div className="space-y-1 overflow-hidden">
                          <div className="text-muted-foreground font-medium truncate">
                            {label}
                          </div>
                          <div className="font-bold leading-tight truncate">
                            {formatValue(
                              label,
                              value as number,
                              (sellerSearchData?.[0] as SellerKpiStats)
                                ?.currency
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  }

                  const colorType = colorTypes[colorIndex % colorTypes.length]
                  const iconBgColor: string | undefined =
                    (kpiCard[
                      `cardIcon${colorType}BackgroundColor` as keyof typeof kpiCard
                    ] as unknown as string | undefined) ||
                    (affiliate && defaultColorPair.iconBg) ||
                    undefined

                  const iconTextColor: string | undefined =
                    (kpiCard[
                      `cardIcon${colorType}Color` as keyof typeof kpiCard
                    ] as unknown as string | undefined) ||
                    (affiliate && defaultColorPair.iconColor) ||
                    undefined

                  const borderColor =
                    (affiliate && kpiCard.cardBorderColor) || "#e5e7eb"
                  const shadowColor =
                    (affiliate && kpiCard.cardShadowColor) ||
                    "rgba(0, 0, 0, 0.1)"
                  const primaryTextColor =
                    (affiliate && kpiCard.cardPrimaryTextColor) || "inherit"
                  const secondaryTextColor =
                    (affiliate && kpiCard.cardSecondaryTextColor) || "#6b7280"

                  return (
                    <div
                      key={label}
                      className={cn(
                        "p-3 flex items-center gap-4 rounded-lg bg-white",
                        isPreview ? "text-sm" : "text-base",
                        affiliate && kpiCard.cardBorder && "border",
                        affiliate &&
                          kpiCard.cardShadow &&
                          `shadow-${(affiliate && kpiCard.cardShadowThickness) || "sm"}`
                      )}
                      style={{
                        borderColor:
                          affiliate && kpiCard.cardBorder
                            ? affiliate && borderColor
                            : undefined,
                        boxShadow:
                          affiliate && kpiCard.cardShadow
                            ? `${
                                affiliate &&
                                kpiCard.cardShadowThickness === "xl"
                                  ? "0 10px 20px"
                                  : affiliate &&
                                      kpiCard.cardShadowThickness === "lg"
                                    ? "0 6px 12px"
                                    : affiliate &&
                                        kpiCard.cardShadowThickness === "md"
                                      ? "0 4px 8px"
                                      : "0 2px 4px"
                              } ${affiliate && shadowColor}`
                            : undefined,
                        background:
                          (affiliate && kpiCard.cardBackgroundColor) ||
                          undefined,
                      }}
                    >
                      <div
                        className={cn(
                          "flex-shrink-0 rounded-xl flex items-center justify-center",
                          isPreview ? "w-8 h-8" : "p-3",
                          typeof iconBgColor === "string" &&
                            affiliate &&
                            iconBgColor.startsWith("bg-")
                            ? affiliate && iconBgColor
                            : ""
                        )}
                        style={{
                          backgroundColor:
                            typeof iconBgColor === "string" &&
                            affiliate &&
                            !iconBgColor.startsWith("bg-")
                              ? affiliate && iconBgColor
                              : undefined,
                        }}
                      >
                        <Icon
                          className={cn(
                            isPreview ? "w-4 h-4" : "w-8 h-8",
                            typeof iconTextColor === "string" &&
                              affiliate &&
                              iconTextColor.startsWith("text-")
                              ? affiliate && iconTextColor
                              : ""
                          )}
                          style={{
                            color:
                              typeof iconTextColor === "string" &&
                              affiliate &&
                              !iconTextColor.startsWith("text-")
                                ? affiliate && iconTextColor
                                : undefined,
                          }}
                        />
                      </div>

                      <div className="space-y-1 overflow-hidden">
                        <div
                          className="truncate font-medium"
                          style={{ color: affiliate && secondaryTextColor }}
                        >
                          {label}
                        </div>
                        <div
                          className="font-bold leading-tight truncate"
                          style={{ color: affiliate && primaryTextColor }}
                        >
                          {formatValue(
                            label,
                            value as number,
                            (affiliateSearchData?.[0] as AffiliateKpiStats)
                              ?.currency
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Cards
