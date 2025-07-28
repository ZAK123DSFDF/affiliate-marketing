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
import { AffiliatePaymentRow } from "@/lib/types/affiliatePaymentRow";
import { usePathname, useRouter } from "next/navigation";
import YearSelect from "@/components/ui-custom/YearSelect";
import { useQuery } from "@tanstack/react-query";
import { getAffiliateCommissionByMonth } from "@/app/affiliate/[orgId]/dashboard/payment/action";
import { localDashboardCustomizationSettings } from "@/lib/types/dashboardCustomization";
import { getShadowWithColor } from "@/util/GetShadowWithColor";

interface AffiliateCommissionTableProps {
  data: AffiliatePaymentRow[];
  isPreview?: boolean;
  customization?: localDashboardCustomizationSettings;
}

export default function AffiliateCommissionTable({
  data,
  isPreview,
  customization,
}: AffiliateCommissionTableProps) {
  const columns: ColumnDef<AffiliatePaymentRow>[] = [
    {
      accessorKey: "month",
      header: () => (
        <span
          style={{
            color: customization?.tableHeaderTextColor || undefined,
          }}
        >
          Month
        </span>
      ),
      cell: ({ row }) => (
        <div
          style={{
            color: customization?.tableRowTertiaryTextColor || undefined,
          }}
        >
          {row.getValue("month")}
        </div>
      ),
    },
    {
      accessorKey: "totalCommission",
      header: () => (
        <span
          style={{
            color: customization?.tableHeaderTextColor || undefined,
          }}
        >
          Total Commission
        </span>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("totalCommission"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
        return (
          <div
            className="text-right font-medium"
            style={{
              color: customization?.tableRowPrimaryTextColor || undefined,
            }}
          >
            {formatted}
          </div>
        );
      },
    },
    {
      accessorKey: "paidCommission",
      header: () => (
        <span
          style={{
            color: customization?.tableHeaderTextColor || undefined,
          }}
        >
          Paid Commission
        </span>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("paidCommission"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
        return (
          <div
            className="text-right font-medium"
            style={{
              color: customization?.tableRowPrimaryTextColor || undefined,
            }}
          >
            {formatted}
          </div>
        );
      },
    },
    {
      accessorKey: "unpaidCommission",
      header: () => (
        <span
          style={{
            color: customization?.tableHeaderTextColor || undefined,
          }}
        >
          Unpaid Commission
        </span>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("unpaidCommission"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
        return (
          <div
            className="text-right font-medium"
            style={{
              color: customization?.tableRowPrimaryTextColor || undefined,
            }}
          >
            {formatted}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => (
        <span
          style={{
            color: customization?.tableHeaderTextColor || undefined,
          }}
        >
          Status
        </span>
      ),
      cell: ({ row }) => {
        const unpaid = parseFloat(row.getValue("unpaidCommission"));
        const monthStr = row.getValue("month") as string;

        const today = new Date();
        const [year, month] = monthStr.split("-").map(Number);
        const rowDate = new Date(year, month - 1);

        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const isSameMonth =
          rowDate.getMonth() === currentMonth &&
          rowDate.getFullYear() === currentYear;

        let status = "Paid";

        let defaultClass =
          "bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800";
        let textColor = customization?.tableRowBadgePaidTextColor;
        let backgroundColor = customization?.tableRowBadgePaidBackgroundColor;

        if (unpaid > 0) {
          if (isSameMonth) {
            status = "Pending";
            defaultClass =
              "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 hover:text-yellow-800";
            textColor = customization?.tableRowBadgePendingTextColor;
            backgroundColor =
              customization?.tableRowBadgePendingBackgroundColor;
          } else if (
            rowDate.getFullYear() < currentYear ||
            (rowDate.getFullYear() === currentYear &&
              rowDate.getMonth() < currentMonth)
          ) {
            status = "Overdue";
            defaultClass =
              "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-800";
            textColor = customization?.tableRowBadgeOverDueTextColor;
            backgroundColor =
              customization?.tableRowBadgeOverDueBackgroundColor;
          }
        }

        const hasCustomStyle = textColor || backgroundColor;

        return hasCustomStyle ? (
          <Badge
            style={{
              color: textColor,
              backgroundColor: backgroundColor,
            }}
          >
            {status}
          </Badge>
        ) : (
          <Badge className={defaultClass}>{status}</Badge>
        );
      },
    },
  ];
  const router = useRouter();
  const pathname = usePathname();
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
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
  const filteredData = React.useMemo(() => {
    if (!isPreview) return data;
    if (!yearValue) return data;

    return data.filter((row) => row.month.startsWith(yearValue.toString()));
  }, [data, yearValue, isPreview]);
  const OnYearChange = (y?: number) => {
    setYearValue(y);
    const qs = y ? `?y=${y}` : "";
    router.replace(`${pathname}${qs}`);
  };

  const { data: yearSelectedData, isPending } = useQuery({
    queryKey: ["affiliate-commissions", yearValue],
    queryFn: () => {
      return getAffiliateCommissionByMonth(yearValue).then((r) =>
        r.ok ? r.data : [],
      );
    },
    enabled: !!yearValue && !isPreview,
  });

  const table = useReactTable({
    data: isPreview
      ? filteredData
      : yearValue && yearSelectedData
        ? yearSelectedData
        : data,
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
          <h1
            className="text-3xl font-bold"
            style={{
              color: customization?.headerNameColor || undefined,
            }}
          >
            Affiliate Earnings
          </h1>
          <p
            className="text-muted-foreground"
            style={{
              color: customization?.headerDescColor || undefined,
            }}
          >
            Monthly breakdown of your affiliate commissions
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <YearSelect
          value={yearValue !== undefined ? { year: yearValue } : {}}
          onChange={OnYearChange}
          customization={customization}
        />
      </div>

      <Card
        style={{
          backgroundColor: customization?.cardBackgroundColor || undefined,
          boxShadow:
            customization?.cardShadow && customization?.cardShadow !== "none"
              ? getShadowWithColor(
                  customization?.cardShadow,
                  customization?.cardShadowColor,
                )
              : "none",
          border: customization?.cardBorder
            ? `1px solid ${customization?.cardBorderColor}`
            : "",
        }}
      >
        <CardHeader>
          <CardTitle
            style={{
              color: customization?.headerNameColor || undefined,
            }}
          >
            Monthly Commission Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          {yearValue !== undefined && isPending && !isPreview ? (
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
