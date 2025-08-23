"use client";

import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AffiliateStats } from "@/lib/types/affiliateStats";
import MonthSelect from "@/components/ui-custom/MonthSelect";
import { useSearch } from "@/hooks/useSearch";
import { getAffiliatesWithStats } from "@/app/seller/[orgId]/dashboard/affiliates/action";
import { TableContent } from "@/components/ui-custom/TableContent";
import { TableTop } from "@/components/ui-custom/TableTop";
import { AffiliatesColumns } from "@/components/pages/Dashboard/Affiliates/AffiliatesColumns";
import { TableLoading } from "@/components/ui-custom/TableLoading";
import { useQueryFilter } from "@/hooks/useQueryFilter";
import PaginationControls from "@/components/ui-custom/PaginationControls";

interface AffiliatesTableProps {
  orgId: string;
  data: AffiliateStats[];
  cardTitle?: string;
  showHeader?: boolean;
  affiliate: boolean;
}
export default function AffiliatesTable({
  orgId,
  data,
  cardTitle = "Overview of all affiliate activities",
  showHeader = false,
  affiliate = false,
}: AffiliatesTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const columns = AffiliatesColumns();
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const { filters, setFilters } = useQueryFilter();
  const { data: searchData, isPending: searchPending } = useSearch(
    [
      "all-affiliates",
      orgId,
      filters.year,
      filters.month,
      filters.orderBy,
      filters.orderDir,
      filters.offset,
      filters.email,
    ],
    getAffiliatesWithStats,
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
      enabled: !!(
        !affiliate &&
        orgId &&
        (filters.year ||
          filters.month ||
          filters.orderBy ||
          filters.orderDir ||
          filters.offset ||
          filters.email)
      ),
    },
  );
  const tableData = searchData ?? data;
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
  });

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
          />

          {(filters.year !== undefined || filters.month !== undefined) &&
          searchPending ? (
            <TableLoading columns={columns} />
          ) : table.getRowModel().rows.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No Affiliates found.
            </div>
          ) : (
            <TableContent table={table} affiliate={false} />
          )}

          <PaginationControls
            offset={filters.offset}
            tableDataLength={tableData.length}
            setFilters={setFilters}
          />
        </CardContent>
      </Card>
    </div>
  );
}
