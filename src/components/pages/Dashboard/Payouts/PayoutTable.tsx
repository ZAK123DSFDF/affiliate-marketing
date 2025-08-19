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

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  getAffiliatePayouts,
  getAffiliatePayoutsBulk,
  getUnpaidMonths,
} from "@/app/seller/[orgId]/dashboard/payout/action";
import { useEffect, useState } from "react";
import MonthSelect from "@/components/ui-custom/MonthSelect";
import { useQuery } from "@tanstack/react-query";
import { UnpaidMonth } from "@/lib/types/unpaidMonth";
import UnpaidSelect from "@/components/ui-custom/UnpaidPicker";
import { AffiliatePayout } from "@/lib/types/affiliateStats";
import { TableContent } from "@/components/ui-custom/TableContent";
import { TableTop } from "@/components/ui-custom/TableTop";
import { PayoutColumns } from "@/components/pages/Dashboard/Payouts/PayoutColumns";
import { useDateFilter } from "@/hooks/useDateFilter";
import { useSearch } from "@/hooks/useSearch";
import { TableLoading } from "@/components/ui-custom/TableLoading";

interface AffiliatesTablePayoutProps {
  data: AffiliatePayout[];
  orgId: string;
}
export default function PayoutTable({
  data,
  orgId,
}: AffiliatesTablePayoutProps) {
  const [monthYear, setMonthYear] = useState<{
    month?: number;
    year?: number;
  }>({});
  const [unpaidMonths, setUnpaidMonths] = useState<UnpaidMonth[]>([]);
  const [selectedMonths, setSelectedMonths] = useState<UnpaidMonth[]>([]);
  const [isUnpaidMode, setIsUnpaidMode] = useState(false);
  const { selectedDate, handleDateChange } = useDateFilter();
  const [unpaidOpen, setUnpaidOpen] = useState(false);
  /* optional: refetch when month changes */

  const { data: unpaidPayouts, isPending: isPendingUnpaid } = useQuery({
    queryKey: ["unpaid-payouts", orgId, selectedMonths],
    queryFn: () =>
      getAffiliatePayoutsBulk(orgId, selectedMonths).then((r) =>
        r.ok ? r.data : [],
      ),
    enabled: isUnpaidMode && selectedMonths.length > 0,
  });

  const { data: regularPayouts, isPending: isPendingRegular } = useSearch(
    ["regular-payouts", orgId, selectedDate.year, selectedDate.month],
    getAffiliatePayouts,
    [orgId, selectedDate.year, selectedDate.month],
    {
      enabled:
        !!(orgId && (selectedDate.year || selectedDate.month)) && !isUnpaidMode,
    },
  );
  const { data: unpaidMonthData, isPending: pendingMonth } = useQuery({
    queryKey: ["unpaid-months", orgId],
    queryFn: () =>
      getUnpaidMonths(orgId).then((res) => (res.ok ? res.data : [])),
    enabled: unpaidOpen,
  });
  const applyUnpaidMonths = () => {
    if (selectedMonths.length > 0) {
      setIsUnpaidMode(true);
      setMonthYear({});
    }
  };
  const clearUnpaidMonths = () => {
    setSelectedMonths([]);
    setIsUnpaidMode(false);
    setMonthYear({});
  };
  const isPending = isUnpaidMode ? isPendingUnpaid : isPendingRegular;
  useEffect(() => {
    if (unpaidMonthData) {
      setUnpaidMonths(unpaidMonthData);
    }
  }, [unpaidMonthData]);
  const tableData =
    (isUnpaidMode ? unpaidPayouts : regularPayouts) ?? data ?? [];
  /* CSV helper */
  const csv = React.useMemo(() => {
    const header = "Email,Sales,Unpaid,Paid,Commission,Status,Links\n";
    return (
      header +
      tableData
        .map(
          (r) =>
            `${r.email},${r.sales},${r.unpaid.toFixed(
              2,
            )},${r.paid.toFixed(2)},${r.commission.toFixed(2)},${
              r.unpaid > 0 ? "pending" : "paid"
            },"${r.links.join(" ")}"`,
        )
        .join("\n")
    );
  }, [tableData]);

  const downloadCSV = () => {
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payouts_${monthYear.year ?? "all"}_${
      monthYear.month ?? "all"
    }.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const columns = PayoutColumns();
  const table = useReactTable({
    data: tableData,
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
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <div>
            <h1 className="text-3xl font-bold">Payments</h1>
            <p className="text-muted-foreground">Manage your payment records</p>
          </div>
        </div>
        <Button>Add Payment</Button>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <MonthSelect
            value={selectedDate}
            onChange={handleDateChange}
            disabled={isUnpaidMode && selectedMonths.length > 0}
            affiliate={false}
          />
          {isUnpaidMode && selectedMonths.length > 0 && (
            <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              <span>Unpaid Months Selected</span>
              <button
                onClick={clearUnpaidMonths}
                className="text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </div>
          )}
        </div>
        <UnpaidSelect
          months={unpaidMonths}
          selection={selectedMonths}
          setSelection={setSelectedMonths}
          loading={pendingMonth}
          onApply={applyUnpaidMonths}
          disabled={isUnpaidMode}
          open={unpaidOpen}
          setOpen={setUnpaidOpen}
        />
        <div className="flex gap-2">
          <Button variant="outline" onClick={downloadCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button
            onClick={() =>
              window.open("https://www.paypal.com/mep/payoutsweb", "_blank")
            }
          >
            Mass Payout
          </Button>
        </div>
      </div>
      {/* Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Records</CardTitle>
        </CardHeader>
        <CardContent>
          <TableTop table={table} />
          {isUnpaidMode ? (
            pendingMonth || isPending ? (
              <TableLoading columns={columns} />
            ) : table.getRowModel().rows.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No Affiliates found
              </div>
            ) : (
              <TableContent table={table} affiliate={false} />
            )
          ) : (selectedDate.year !== undefined ||
              selectedDate.month !== undefined) &&
            isPending ? (
            <TableLoading columns={columns} />
          ) : table.getRowModel().rows.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No Affiliates found
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
