import { ColumnDef } from "@tanstack/react-table";
import { AffiliatePaymentRow } from "@/lib/types/affiliatePaymentRow";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { useTableCustomizationOption } from "@/hooks/useDashboardCustomization";

export const paymentColumns = (
  affiliate: boolean,
): ColumnDef<AffiliatePaymentRow>[] => {
  const dashboardTable = useTableCustomizationOption();
  return [
    {
      accessorKey: "month",
      header: () => (
        <span
          style={{
            color:
              (affiliate && dashboardTable.tableHeaderTextColor) || undefined,
          }}
        >
          Month
        </span>
      ),
      cell: ({ row }) => (
        <div
          style={{
            color:
              (affiliate && dashboardTable.tableRowTertiaryTextColor) ||
              undefined,
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
            color:
              (affiliate && dashboardTable.tableHeaderTextColor) || undefined,
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
              color:
                (affiliate && dashboardTable.tableRowPrimaryTextColor) ||
                undefined,
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
            color:
              (affiliate && dashboardTable.tableHeaderTextColor) || undefined,
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
              color:
                (affiliate && dashboardTable.tableRowPrimaryTextColor) ||
                undefined,
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
            color:
              (affiliate && dashboardTable.tableHeaderTextColor) || undefined,
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
              color:
                (affiliate && dashboardTable.tableRowPrimaryTextColor) ||
                undefined,
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
            color:
              (affiliate && dashboardTable.tableHeaderTextColor) || undefined,
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
        let textColor =
          (affiliate && dashboardTable.tableRowBadgePaidTextColor) || undefined;
        let backgroundColor =
          (affiliate && dashboardTable.tableRowBadgePaidBackgroundColor) ||
          undefined;

        if (unpaid > 0) {
          if (isSameMonth) {
            status = "Pending";
            defaultClass =
              "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 hover:text-yellow-800";
            textColor =
              (affiliate && dashboardTable.tableRowBadgePendingTextColor) ||
              undefined;
            backgroundColor =
              (affiliate &&
                dashboardTable.tableRowBadgePendingBackgroundColor) ||
              undefined;
          } else if (
            rowDate.getFullYear() < currentYear ||
            (rowDate.getFullYear() === currentYear &&
              rowDate.getMonth() < currentMonth)
          ) {
            status = "Overdue";
            defaultClass =
              "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-800";
            textColor = affiliate
              ? dashboardTable.tableRowBadgeOverDueTextColor
              : undefined;
            backgroundColor = affiliate
              ? dashboardTable.tableRowBadgeOverDueBackgroundColor
              : undefined;
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
};
