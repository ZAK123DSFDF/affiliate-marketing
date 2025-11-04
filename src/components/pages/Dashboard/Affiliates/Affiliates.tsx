"use client"

import * as React from "react"
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import MonthSelect from "@/components/ui-custom/MonthSelect"
import { getAffiliatesWithStats } from "@/app/(organization)/organization/[orgId]/dashboard/affiliates/action"
import { TableTop } from "@/components/ui-custom/TableTop"
import { AffiliatesColumns } from "@/components/pages/Dashboard/Affiliates/AffiliatesColumns"
import { useQueryFilter } from "@/hooks/useQueryFilter"
import PaginationControls from "@/components/ui-custom/PaginationControls"
import { useAppQuery } from "@/hooks/useAppQuery"
import { TableView } from "@/components/ui-custom/TableView"
import { getTeamAffiliatesWithStats } from "@/app/(organization)/organization/[orgId]/teams/dashboard/affiliates/action"
import { useVerifyTeamSession } from "@/hooks/useVerifyTeamSession"

interface AffiliatesTableProps {
  orgId: string
  cardTitle?: string
  showHeader?: boolean
  affiliate: boolean
  mode?: "default" | "top"
  isTeam?: boolean
}
export default function AffiliatesTable({
  orgId,
  cardTitle = "Overview of all affiliate activities",
  showHeader = false,
  affiliate = false,
  mode = "default",
  isTeam = false,
}: AffiliatesTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  useVerifyTeamSession(orgId, isTeam)
  const columns = AffiliatesColumns()
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const { filters, setFilters } = useQueryFilter()
  const fetchFn = isTeam ? getTeamAffiliatesWithStats : getAffiliatesWithStats
  const {
    data: searchData,
    error: searchError,
    isPending: searchPending,
  } = useAppQuery(
    [
      isTeam ? "team-affiliates" : "org-affiliates",
      orgId,
      filters.year,
      filters.month,
      filters.orderBy,
      filters.orderDir,
      filters.offset,
      filters.email,
    ],
    fetchFn,
    [
      orgId,
      filters.year,
      filters.month,
      filters.orderBy === "none" ? undefined : filters.orderBy,
      filters.orderDir,
      filters.offset,
      filters.email,
    ],
    {
      enabled: !!(!affiliate && orgId),
    }
  )
  const tableData = searchData ?? []
  const table = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualFiltering: true,
    manualPagination: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      {showHeader && (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
            <div>
              <h1 className="text-3xl font-bold">Affiliates</h1>
              <p className="text-muted-foreground">
                Track and manage your affiliate performance metrics
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Table Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">{cardTitle}</CardTitle>
          <MonthSelect
            value={{ year: filters.year, month: filters.month }}
            onChange={(year, month) => setFilters({ year, month })}
            affiliate={false}
          />
        </CardHeader>
        <CardContent>
          <TableTop
            filters={{
              orderBy: filters.orderBy,
              orderDir: filters.orderDir,
              email: filters.email,
            }}
            onOrderChange={(orderBy, orderDir) =>
              setFilters({ orderBy, orderDir })
            }
            onEmailChange={(email) => setFilters({ email: email || undefined })}
            affiliate={false}
            table={table}
            mode={mode}
          />

          <TableView
            isPending={searchPending}
            error={searchError}
            table={table}
            affiliate={false}
            columns={columns}
            tableEmptyText="No Affiliates found."
          />

          {mode === "default" && (
            <PaginationControls
              offset={filters.offset}
              tableDataLength={tableData.length}
              setFilters={setFilters}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
