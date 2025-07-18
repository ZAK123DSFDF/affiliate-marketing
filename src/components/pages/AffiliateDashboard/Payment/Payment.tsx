"use client";

import React, { useEffect, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AffiliatePaymentRow } from "@/lib/types/affiliatePaymentRow";
import { usePathname, useRouter } from "next/navigation";
import YearSelect from "@/components/ui-custom/YearSelect";
import { useQuery } from "@tanstack/react-query";
import { getAffiliateCommissionByMonth } from "@/app/affiliate/[orgId]/dashboard/payment/action";

interface AffiliateCommissionTableProps {
  data: AffiliatePaymentRow[];
}

const columns: ColumnDef<AffiliatePaymentRow>[] = [
  {
    accessorKey: "month",
    header: "Month",
    cell: ({ row }) => <div>{row.getValue("month")}</div>,
  },
  {
    accessorKey: "totalCommission",
    header: () => <div className="text-right">Total Commission</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalCommission"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "paidCommission",
    header: () => <div className="text-right">Paid Commission</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("paidCommission"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "unpaidCommission",
    header: () => <div className="text-right">Unpaid Commission</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("unpaidCommission"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const unpaid = parseFloat(row.getValue("unpaidCommission"));
      const monthStr = row.getValue("month") as string;

      const today = new Date();
      const [year, month] = monthStr.split("-").map(Number);
      const rowDate = new Date(year, month - 1); // zero-based month

      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      const isSameMonth =
        rowDate.getMonth() === currentMonth &&
        rowDate.getFullYear() === currentYear;

      let status = "Paid";
      let badgeClass =
        "bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800"; // Paid

      if (unpaid > 0) {
        if (isSameMonth) {
          status = "Pending";
          badgeClass =
            "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 hover:text-yellow-800";
        } else if (
          rowDate.getFullYear() < currentYear ||
          (rowDate.getFullYear() === currentYear &&
            rowDate.getMonth() < currentMonth)
        ) {
          status = "Overdue";
          badgeClass =
            "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-800";
        }
      }

      return <Badge className={badgeClass}>{status}</Badge>;
    },
  },
];

export default function AffiliateCommissionTable({
  data,
}: AffiliateCommissionTableProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [yearValue, setYearValue] = useState<number | undefined>(undefined);
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const year = searchParams.get("y");
    if (year) {
      const parsed = parseInt(year);
      if (!isNaN(parsed)) {
        setYearValue(parsed);
      }
    }
  }, []);

  const OnYearChange = (y?: number) => {
    setYearValue(y);
    const qs = y ? `?y=${y}` : "";
    router.replace(`${pathname}${qs}`);
  };

  const { data: yearSelectedData, isPending } = useQuery({
    queryKey: ["affiliate-commissions", yearValue],
    queryFn: () =>
      getAffiliateCommissionByMonth(yearValue!).then((r) =>
        r.ok ? r.data : [],
      ),
    enabled: !!yearValue,
  });

  const table = useReactTable({
    data: yearValue && yearSelectedData ? yearSelectedData : data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Affiliate Earnings</h1>
          <p className="text-muted-foreground">
            Monthly breakdown of your affiliate commissions
          </p>
        </div>
        <Input
          placeholder="Filter by month (e.g. 2025-07)..."
          value={(table.getColumn("month")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("month")?.setFilterValue(e.target.value)
          }
          className="w-64"
        />
      </div>

      <div className="flex justify-between items-center">
        <YearSelect
          value={yearValue !== undefined ? { year: yearValue } : {}}
          onChange={OnYearChange}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Commission Stats</CardTitle>
        </CardHeader>
        <CardContent>
          {yearValue !== undefined && isPending ? (
            <div className="rounded-md border">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-600" />
                        <span className="text-sm text-muted-foreground">
                          Loading...
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ) : table.getRowModel().rows.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No commission data available.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
