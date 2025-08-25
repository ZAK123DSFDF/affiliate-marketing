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

import { AffiliatePaymentRow } from "@/lib/types/affiliatePaymentRow"
import YearSelect from "@/components/ui-custom/YearSelect"
import { getAffiliateCommissionByMonth } from "@/app/affiliate/[orgId]/dashboard/payment/action"
import { DashboardThemeCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/DashboardThemeCustomizationOptions"
import { DashboardCardCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/DashboardCardCustomizationOptions"
import { TableCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/TableCustomizationOptions"
import { YearSelectCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/YearSelectCustomizationOptions"
import { useDashboardThemeCustomizationOption } from "@/hooks/useDashboardCustomization"
import { useCustomizationSync } from "@/hooks/useCustomizationSync"
import PendingState from "@/components/ui-custom/PendingState"
import ErrorState from "@/components/ui-custom/ErrorState"
import { TableContent } from "@/components/ui-custom/TableContent"
import { TableLoading } from "@/components/ui-custom/TableLoading"
import { paymentColumns } from "@/components/pages/AffiliateDashboard/Payment/PaymentColumns"
import { useSearch } from "@/hooks/useSearch"
import { useQueryFilter } from "@/hooks/useQueryFilter"
import { useDashboardCard } from "@/hooks/useDashboardCard"

interface AffiliateCommissionTableProps {
  orgId: string
  data: AffiliatePaymentRow[]
  isPreview?: boolean
  affiliate: boolean
}

export default function AffiliateCommissionTable({
  orgId,
  data,
  isPreview,
  affiliate = false,
}: AffiliateCommissionTableProps) {
  const dashboardTheme = useDashboardThemeCustomizationOption()
  const { filters, setFilters } = useQueryFilter()
  const {
    isPending: globalPending,
    isError,
    refetch,
  } = affiliate
    ? useCustomizationSync(orgId, "dashboard")
    : { isPending: false, isError: false, refetch: () => {} }
  const [isFakeLoadingPreview, setIsFakeLoadingPreview] = useState(false)
  useEffect(() => {
    if (!isPreview) return

    setIsFakeLoadingPreview(true)

    const timer = setTimeout(() => {
      setIsFakeLoadingPreview(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [filters, isPreview])
  const filteredData = React.useMemo(() => {
    if (!isPreview) return data
    if (!filters.year) return data

    return data.filter((row) =>
      filters.year ? row.month.startsWith(filters.year.toString()) : true
    )
  }, [data, filters.year, isPreview])
  const { data: yearSelectedData, isPending } = useSearch(
    ["affiliate-commissions", orgId, filters.year],
    getAffiliateCommissionByMonth,
    [filters.year],
    {
      enabled: !!(orgId && filters.year && !isPreview),
    }
  )
  const columns = paymentColumns(affiliate)
  const table = useReactTable({
    data: isPreview
      ? filteredData
      : filters.year && yearSelectedData
        ? yearSelectedData
        : data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })
  if (globalPending) {
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
              Affiliate Earnings
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
              Monthly breakdown of your affiliate commissions
            </p>
            {isPreview && (
              <DashboardThemeCustomizationOptions
                name="dashboardHeaderDescColor"
                buttonSize="w-4 h-4"
              />
            )}
          </div>
        </div>
      </div>
      <Card className="relative" style={useDashboardCard(affiliate)}>
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
            <TableCustomizationOptions triggerSize="w-6 h-6" type="payment" />
          </div>
        )}
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle
            style={{
              color:
                (affiliate && dashboardTheme.cardHeaderPrimaryTextColor) ||
                undefined,
            }}
          >
            <div className="flex flex-row gap-2 items-center">
              Monthly Commission Stats
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
            <YearSelect
              value={{ year: filters.year }}
              onChange={(year) => setFilters({ year })}
              affiliate={affiliate}
              allowAll={false}
            />
          </div>
        </CardHeader>
        <CardContent>
          {filters.year !== undefined &&
          ((isPending && !isPreview) || (isPreview && isFakeLoadingPreview)) ? (
            <TableLoading columns={columns} />
          ) : table.getRowModel().rows.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No commission data available.
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
