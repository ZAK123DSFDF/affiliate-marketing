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
import { DashboardThemeCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/DashboardThemeCustomizationOptions";
import { DashboardCardCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/DashboardCardCustomizationOptions";
import { TableCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/TableCustomizationOptions";
import { cn } from "@/lib/utils";
import { YearSelectCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/YearSelectCustomizationOptions";
import {
  useDashboardCardCustomizationOption,
  useDashboardThemeCustomizationOption,
  useTableCustomizationOption,
} from "@/hooks/useDashboardCustomization";
import { toValidShadowSize } from "@/util/ValidateShadowColor";

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
  const dashboardTheme = useDashboardThemeCustomizationOption();
  const dashboardCard = useDashboardCardCustomizationOption();
  const dashboardTable = useTableCustomizationOption();
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const columns: ColumnDef<AffiliatePaymentRow>[] = [
    {
      accessorKey: "month",
      header: () => (
        <span
          style={{
            color: dashboardTable.tableHeaderTextColor || undefined,
          }}
        >
          Month
        </span>
      ),
      cell: ({ row }) => (
        <div
          style={{
            color: dashboardTable.tableRowTertiaryTextColor || undefined,
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
            color: dashboardTable.tableHeaderTextColor || undefined,
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
            className=" font-medium"
            style={{
              color: dashboardTable.tableRowPrimaryTextColor || undefined,
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
            color: dashboardTable.tableHeaderTextColor || undefined,
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
            className=" font-medium"
            style={{
              color: dashboardTable.tableRowPrimaryTextColor || undefined,
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
            color: dashboardTable.tableHeaderTextColor || undefined,
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
            className=" font-medium"
            style={{
              color: dashboardTable.tableRowPrimaryTextColor || undefined,
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
            color: dashboardTable.tableHeaderTextColor || undefined,
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
        let textColor = dashboardTable.tableRowBadgePaidTextColor;
        let backgroundColor = dashboardTable.tableRowBadgePaidBackgroundColor;

        if (unpaid > 0) {
          if (isSameMonth) {
            status = "Pending";
            defaultClass =
              "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 hover:text-yellow-800";
            textColor = dashboardTable.tableRowBadgePendingTextColor;
            backgroundColor =
              dashboardTable.tableRowBadgePendingBackgroundColor;
          } else if (
            rowDate.getFullYear() < currentYear ||
            (rowDate.getFullYear() === currentYear &&
              rowDate.getMonth() < currentMonth)
          ) {
            status = "Overdue";
            defaultClass =
              "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-800";
            textColor = dashboardTable.tableRowBadgeOverDueTextColor;
            backgroundColor =
              dashboardTable.tableRowBadgeOverDueBackgroundColor;
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
          <div className="flex flex-row gap-2 items-center">
            <h1
              className="text-3xl font-bold"
              style={{
                color: dashboardTheme.dashboardHeaderNameColor || undefined,
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
                color: dashboardTheme.dashboardHeaderDescColor || undefined,
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
      <Card
        className="relative"
        style={{
          backgroundColor:
            dashboardCard.dashboardCardBackgroundColor || undefined,
          boxShadow:
            dashboardCard.dashboardCardShadow &&
            dashboardCard.dashboardCardShadow !== "none"
              ? getShadowWithColor(
                  toValidShadowSize(dashboardCard.dashboardCardShadowThickness),
                  dashboardCard.dashboardCardShadowColor,
                )
              : "",
          border: dashboardCard.dashboardCardBorder
            ? `1px solid ${dashboardCard.dashboardCardBorderColor}`
            : "none",
        }}
      >
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
              color: dashboardTheme.cardHeaderPrimaryTextColor || undefined,
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
              value={yearValue !== undefined ? { year: yearValue } : {}}
              onChange={OnYearChange}
            />
          </div>
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
            <div
              className={cn(
                "rounded-md border overflow-hidden",
                isPreview && "mb-4",
              )}
              style={{
                borderColor: dashboardTable.tableBorderColor || undefined,
                borderWidth: "1px",
                borderStyle: "solid",
              }}
            >
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      onMouseEnter={() => setIsHeaderHovered(true)}
                      onMouseLeave={() => setIsHeaderHovered(false)}
                      style={{
                        backgroundColor: isHeaderHovered
                          ? dashboardTable.tableHoverBackgroundColor ||
                            "#f9fafb"
                          : undefined,
                        transition: "background-color 0.2s ease",
                      }}
                    >
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          style={{
                            borderBottom: `1px solid ${dashboardTable.tableBorderColor || "#e5e7eb"}`,
                            color:
                              dashboardTable.tableHeaderTextColor || undefined,
                          }}
                        >
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
                  {table.getRowModel().rows.map((row, idx, allRows) => {
                    const isHovered = hoveredRowId === row.id;
                    const defaultHoverBg = "#f9fafb";

                    return (
                      <TableRow
                        key={row.id}
                        onMouseEnter={() => setHoveredRowId(row.id)}
                        onMouseLeave={() => setHoveredRowId(null)}
                        className={cn(
                          "group",
                          idx === 0 && "rounded-t-md",
                          idx === allRows.length - 1 && "rounded-b-md",
                          "overflow-hidden",
                        )}
                        style={{
                          backgroundColor: isHovered
                            ? dashboardTable.tableHoverBackgroundColor ||
                              defaultHoverBg
                            : undefined,
                          transition: "background-color 0.2s ease",
                          borderBottom:
                            idx !== allRows.length - 1
                              ? `1px solid ${dashboardTable.tableBorderColor || "#e5e7eb"}`
                              : "none",
                        }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
