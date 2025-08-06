"use client";

import React, { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { createAffiliateLink } from "@/app/affiliate/[orgId]/dashboard/links/action";
import { toast } from "@/hooks/use-toast";
import { AffiliateLinkWithStats } from "@/lib/types/affiliateLinkWithStats";
import { Check, Copy } from "lucide-react";
import { localDashboardCustomizationSettings } from "@/lib/types/dashboardCustomization";
import { getShadowWithColor } from "@/util/GetShadowWithColor";
import MonthSelect from "@/components/ui-custom/MonthSelect";
import { DashboardThemeCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/DashboardThemeCustomizationOptions";
import { DashboardButtonCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/DashboardButtonCustomizationOptions";
import { DashboardCardCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/DashboardCardCustomizationOptions";
import { cn } from "@/lib/utils";
import { TableCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/TableCustomizationOptions";
import { YearSelectCustomizationOptions } from "@/components/ui-custom/Customization/DashboardCustomization/YearSelectCustomizationOptions";
import {
  useDashboardButtonCustomizationOption,
  useDashboardCardCustomizationOption,
  useDashboardThemeCustomizationOption,
  useTableCustomizationOption,
} from "@/hooks/useDashboardCustomization";
import { toValidShadowSize } from "@/util/ValidateShadowColor";

interface AffiliateLinkProps {
  data: AffiliateLinkWithStats[];
  isPreview?: boolean;
  customization?: localDashboardCustomizationSettings;
  isTopLinksView?: boolean;
}
export default function Links({
  data,
  isPreview,
  customization,
  isTopLinksView = false,
}: AffiliateLinkProps) {
  const dashboardTheme = useDashboardThemeCustomizationOption();
  const dashboardButton = useDashboardButtonCustomizationOption();
  const dashboardCard = useDashboardCardCustomizationOption();
  const dashboardTable = useTableCustomizationOption();
  const columns: ColumnDef<AffiliateLinkWithStats>[] = [
    {
      accessorKey: "fullUrl",
      header: () => (
        <span
          style={{
            color: dashboardTable.tableHeaderTextColor || undefined,
          }}
        >
          Affiliate Link
        </span>
      ),
      cell: ({ row }) => {
        const url: string = row.getValue("fullUrl");
        const [isHovered, setIsHovered] = useState(false);
        const [copied, setCopied] = useState(false);

        const handleCopy = () => {
          navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1000);
          });
        };
        const iconColor = copied
          ? dashboardTable.tableIconHoverColor || "#2563eb"
          : isHovered
            ? dashboardTable.tableIconHoverColor || "#2563eb"
            : dashboardTable.tableIconColor || "";

        const iconBgColor = copied
          ? "transparent"
          : isHovered
            ? dashboardTable.tableIconHoverBackgroundColor || "#dbeafe"
            : "transparent";
        return (
          <div
            className="flex items-center"
            style={{
              color: dashboardTable.tableRowSecondaryTextColor || undefined,
            }}
          >
            <span className="break-all">{url}</span>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={handleCopy}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="ml-5 flex items-center gap-[2px] text-xs rounded-md transition-colors"
              style={{
                color: iconColor,
                backgroundColor: iconBgColor,
              }}
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" style={{ color: iconColor }} />
                  <span style={{ color: iconColor }}>Copied</span>
                </>
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: "clicks",
      header: () => (
        <span
          style={{
            color: dashboardTable.tableHeaderTextColor || undefined,
          }}
        >
          Clicks
        </span>
      ),
      cell: ({ row }) => (
        <div
          style={{
            color: dashboardTable.tableRowTertiaryTextColor || undefined,
          }}
        >
          {row.getValue("clicks")}
        </div>
      ),
    },
    {
      accessorKey: "sales",
      header: () => (
        <span
          style={{
            color: dashboardTable.tableHeaderTextColor || undefined,
          }}
        >
          Sales
        </span>
      ),
      cell: ({ row }) => (
        <div
          style={{
            color: dashboardTable.tableRowTertiaryTextColor || undefined,
          }}
        >
          {row.getValue("sales")}
        </div>
      ),
    },
    {
      accessorKey: "conversionRate",
      header: () => (
        <span
          style={{
            color: dashboardTable.tableHeaderTextColor || undefined,
          }}
        >
          Conversion Rate
        </span>
      ),
      cell: ({ row }) => (
        <div
          style={{
            color: dashboardTable.tableRowTertiaryTextColor || undefined,
          }}
        >
          {row.getValue("conversionRate")}%
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: () => (
        <span
          style={{
            color: dashboardTable.tableHeaderTextColor || undefined,
          }}
        >
          Created
        </span>
      ),
      cell: ({ row }) => (
        <div
          style={{
            color: dashboardTable.tableRowTertiaryTextColor || undefined,
          }}
        >
          {new Date(row.getValue("createdAt")).toLocaleDateString()}
        </div>
      ),
    },
  ];
  const [isFakeLoading, setIsFakeLoading] = useState(false);
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const [selectedDate, setSelectedDate] = useState<{
    year?: number;
    month?: number;
  }>({});
  const mutation = useMutation({
    mutationFn: createAffiliateLink,
    onSuccess: async (newLink: string) => {
      toast({ title: "Link created!", description: newLink });
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "We couldn't create the affiliate link.",
        variant: "destructive",
      });
    },
  });

  const handleCreate = () => {
    if (isPreview) {
      setIsFakeLoading(true);
      setTimeout(() => {
        setIsFakeLoading(false);
        toast({
          title: "Preview Mode",
          description: "Simulated link creation.",
        });
      }, 1500);
    } else {
      mutation.mutate();
    }
  };
  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="flex flex-col gap-6">
      {!isTopLinksView && (
        <div className="flex justify-between items-center">
          <div>
            <div className="flex flex-row gap-2 items-center">
              <h1
                className="text-3xl font-bold"
                style={{
                  color: dashboardTheme.dashboardHeaderNameColor || undefined,
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
                  color: dashboardTheme.dashboardHeaderDescColor || undefined,
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
                    ? dashboardButton.dashboardButtonDisabledBackgroundColor ||
                      undefined
                    : dashboardButton.dashboardButtonBackgroundColor ||
                      undefined,
                color:
                  mutation.isPending || isFakeLoading
                    ? dashboardButton.dashboardButtonDisabledTextColor ||
                      undefined
                    : dashboardButton.dashboardButtonTextColor || undefined,
              }}
            >
              {mutation.isPending || isFakeLoading
                ? "Creating..."
                : "Create New Link"}
            </Button>
          </div>
        </div>
      )}

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
            <TableCustomizationOptions triggerSize="w-6 h-6" />
          </div>
        )}
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle
            style={{
              color: dashboardTheme.cardHeaderPrimaryTextColor || undefined,
            }}
            className="text-lg"
          >
            <div className="flex flex-row items-center gap-2">
              {isTopLinksView ? "Top Performing Links" : "Link Stats"}

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
              value={selectedDate}
              onChange={(month, year) => setSelectedDate({ month, year })}
            />
          </div>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No links found.
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
                    const defaultHoverBg = "#f9fafb"; // fallback light gray

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
