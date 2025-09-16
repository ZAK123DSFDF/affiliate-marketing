"use client"

import React, { useEffect, useState } from "react"
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import {
  createAffiliateLink,
  getAffiliateLinksWithStats,
} from "@/app/affiliate/[orgId]/dashboard/links/action"
import { AffiliateLinkWithStats } from "@/lib/types/affiliateLinkWithStats"
import MonthSelect from "@/components/ui-custom/MonthSelect"
import { DashboardThemeCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/DashboardThemeCustomizationOptions"
import { DashboardButtonCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/DashboardButtonCustomizationOptions"
import { DashboardCardCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/DashboardCardCustomizationOptions"
import { TableCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/TableCustomizationOptions"
import { YearSelectCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/YearSelectCustomizationOptions"
import {
  useDashboardButtonCustomizationOption,
  useDashboardThemeCustomizationOption,
} from "@/hooks/useDashboardCustomization"
import { useCustomToast } from "@/components/ui-custom/ShowCustomToast"
import { useCustomizationSync } from "@/hooks/useCustomizationSync"
import PendingState from "@/components/ui-custom/PendingState"
import ErrorState from "@/components/ui-custom/ErrorState"
import { useSearch } from "@/hooks/useSearch"
import { useQueryFilter } from "@/hooks/useQueryFilter"
import { TableContent } from "@/components/ui-custom/TableContent"
import { LinksColumns } from "@/components/pages/AffiliateDashboard/Links/LinksColumns"
import { TableLoading } from "@/components/ui-custom/TableLoading"
import { DummyAffiliateLink } from "@/lib/types/DummyAffiliateLink"
import { useDashboardCard } from "@/hooks/useDashboardCard"

interface AffiliateLinkProps {
  orgId: string
  data: AffiliateLinkWithStats[] | DummyAffiliateLink[]
  isPreview?: boolean
  affiliate: boolean
}
export default function Links({
  orgId,
  data,
  isPreview,
  affiliate,
}: AffiliateLinkProps) {
  const dashboardTheme = useDashboardThemeCustomizationOption()
  const dashboardButton = useDashboardButtonCustomizationOption()
  const dashboardCardStyle = useDashboardCard(affiliate)
  const { showCustomToast } = useCustomToast()
  const { isPending, isError, refetch } = affiliate
    ? useCustomizationSync(orgId, "dashboard")
    : { isPending: false, isError: false, refetch: () => {} }

  const [isFakeLoading, setIsFakeLoading] = useState(false)
  const [isFakeLoadingPreview, setIsFakeLoadingPreview] = useState(false)
  const { filters, setFilters } = useQueryFilter()
  useEffect(() => {
    if (!isPreview) return

    setIsFakeLoadingPreview(true)

    const timer = setTimeout(() => {
      setIsFakeLoadingPreview(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [filters, isPreview])
  const filteredPreviewData = React.useMemo(() => {
    if (!isPreview) return data as AffiliateLinkWithStats[]

    return (data as DummyAffiliateLink[]).map((link) => {
      const filteredClicks = link.clicks.filter((c) => {
        const d = new Date(c.createdAt)
        const matchesYear = filters.year
          ? d.getFullYear() === filters.year
          : true
        const matchesMonth =
          filters.year === undefined
            ? true
            : filters.month
              ? d.getMonth() + 1 === filters.month
              : true
        return matchesYear && matchesMonth
      })

      const filteredSales = link.sales.filter((s) => {
        const d = new Date(s.createdAt)
        const matchesYear = filters.year
          ? d.getFullYear() === filters.year
          : true
        const matchesMonth = filters.month
          ? d.getMonth() + 1 === filters.month
          : true
        return matchesYear && matchesMonth
      })

      const totalClicks = filteredClicks.reduce((sum, c) => sum + c.count, 0)
      const totalSales = filteredSales.reduce((sum, s) => sum + s.count, 0)
      const conversionRate =
        totalClicks > 0
          ? parseFloat(((totalSales / totalClicks) * 100).toFixed(2))
          : 0

      return {
        id: link.id,
        fullUrl: link.fullUrl,
        createdAt: link.createdAt,
        clicks: totalClicks,
        sales: totalSales,
        conversionRate,
      } satisfies AffiliateLinkWithStats
    })
  }, [data, filters, isPreview])
  const { data: searchData, isPending: searchPending } = useSearch(
    ["affiliate-links", orgId, filters.year, filters.month],
    getAffiliateLinksWithStats,
    [orgId, filters.year, filters.month],
    {
      enabled: !!(orgId && (filters.year || filters.month) && !isPreview),
    }
  )
  const mutation = useMutation({
    mutationFn: createAffiliateLink,
    onSuccess: async (newLink: string) => {
      showCustomToast({
        type: "success",
        title: "Link created!",
        description: newLink,
        affiliate,
      })
    },
    onError: () => {
      showCustomToast({
        type: "error",
        title: "Something went wrong",
        description: "We couldn't create the affiliate link.",
        affiliate,
      })
    },
  })

  const handleCreate = () => {
    if (isPreview) {
      setIsFakeLoading(true)
      setTimeout(() => {
        setIsFakeLoading(false)
        showCustomToast({
          type: "success",
          title: "Preview Mode",
          description: "Simulated link creation.",
          affiliate,
        })
      }, 1500)
    } else {
      mutation.mutate(orgId)
    }
  }
  const columns = LinksColumns(affiliate)
  const table = useReactTable({
    data: isPreview
      ? filteredPreviewData
      : (searchData ?? (data as AffiliateLinkWithStats[])),
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })
  if (isPending) {
    return <PendingState withoutBackground />
  }
  if (isError) {
    return <ErrorState onRetry={refetch} />
  }
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex flex-row gap-2 items-center">
            <h1
              className="text-3xl font-bold"
              style={{
                color:
                  (affiliate && dashboardTheme.dashboardHeaderNameColor) ||
                  undefined,
              }}
            >
              Affiliate Links
            </h1>
            {isPreview && (
              <DashboardThemeCustomizationOptions
                name="dashboardHeaderNameColor"
                buttonSize="w-4 h-4"
              />
            )}
          </div>
          <div className="flex flex-row gap-2 items-center">
            <p
              className="text-muted-foreground"
              style={{
                color:
                  (affiliate && dashboardTheme.dashboardHeaderDescColor) ||
                  undefined,
              }}
            >
              Track your referral links and their performance
            </p>
            {isPreview && (
              <DashboardThemeCustomizationOptions
                name="dashboardHeaderDescColor"
                buttonSize="w-4 h-4"
              />
            )}
          </div>
        </div>
        <div className="flex flex-row gap-2 items-center">
          {isPreview && (
            <DashboardButtonCustomizationOptions triggerSize="w-6 h-6" />
          )}
          <Button
            onClick={handleCreate}
            disabled={mutation.isPending || isFakeLoading}
            style={{
              backgroundColor:
                mutation.isPending || isFakeLoading
                  ? (affiliate &&
                      dashboardButton.dashboardButtonDisabledBackgroundColor) ||
                    undefined
                  : (affiliate &&
                      dashboardButton.dashboardButtonBackgroundColor) ||
                    undefined,
              color:
                mutation.isPending || isFakeLoading
                  ? (affiliate &&
                      dashboardButton.dashboardButtonDisabledTextColor) ||
                    undefined
                  : (affiliate && dashboardButton.dashboardButtonTextColor) ||
                    undefined,
            }}
          >
            {mutation.isPending || isFakeLoading
              ? "Creating..."
              : "Create New Link"}
          </Button>
        </div>
      </div>

      <Card className="relative" style={dashboardCardStyle}>
        {isPreview && (
          <div className="absolute bottom-0 left-0 p-2">
            <DashboardCardCustomizationOptions
              triggerSize="w-6 h-6"
              dropdownSize="w-[150px]"
            />
          </div>
        )}{" "}
        {isPreview && (
          <div className="absolute bottom-0 right-0 p-2">
            <TableCustomizationOptions triggerSize="w-6 h-6" type="link" />
          </div>
        )}
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle
            style={{
              color:
                (affiliate && dashboardTheme.cardHeaderPrimaryTextColor) ||
                undefined,
            }}
            className="text-lg"
          >
            <div className="flex flex-row items-center gap-2">
              Link Stats
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
        </CardHeader>
        <CardContent>
          {(filters.year !== undefined || filters.month !== undefined) &&
          ((searchPending && !isPreview) ||
            (isPreview && isFakeLoadingPreview)) ? (
            <TableLoading columns={columns} />
          ) : table.getRowModel().rows.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No links found.
            </div>
          ) : (
            <TableContent
              table={table}
              affiliate={affiliate}
              isPreview={isPreview}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
