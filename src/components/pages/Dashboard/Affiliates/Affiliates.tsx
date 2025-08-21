"use client";

import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AffiliateStats } from "@/lib/types/affiliateStats";
import MonthSelect from "@/components/ui-custom/MonthSelect";
import { useDateFilter } from "@/hooks/useDateFilter";
import { useSearch } from "@/hooks/useSearch";
import { getAffiliatesWithStats } from "@/app/seller/[orgId]/dashboard/affiliates/action";
import { TableContent } from "@/components/ui-custom/TableContent";
import { TableTop } from "@/components/ui-custom/TableTop";
import { AffiliatesColumns } from "@/components/pages/Dashboard/Affiliates/AffiliatesColumns";
import { TableLoading } from "@/components/ui-custom/TableLoading";

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
  const { selectedDate, handleDateChange } = useDateFilter();
  const { data: searchData, isPending: searchPending } = useSearch(
    ["all-affiliates", orgId, selectedDate.year, selectedDate.month],
    getAffiliatesWithStats,
    [orgId, selectedDate.year, selectedDate.month],
    {
      enabled: !!(
        !affiliate &&
        orgId &&
        (selectedDate.year || selectedDate.month)
      ),
    },
  );
  const table = useReactTable({
    data: searchData ?? data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
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
            value={selectedDate}
            onChange={handleDateChange}
            affiliate={false}
          />
        </CardHeader>
        <CardContent>
          <TableTop table={table} />
          {(selectedDate.year !== undefined ||
            selectedDate.month !== undefined) &&
          searchPending ? (
            <TableLoading columns={columns} />
          ) : table.getRowModel().rows.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No links found.
            </div>
          ) : (
            <TableContent table={table} affiliate={false} />
          )}

          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
