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
import { cn } from "@/lib/utils";
import {
  dashboardCustomizationSettings,
  localDashboardCustomizationSettings,
} from "@/lib/types/dashboardCustomization";
import { getShadowWithColor } from "@/util/GetShadowWithColor";

interface AffiliateLinkProps {
  data: AffiliateLinkWithStats[];
  isPreview?: boolean;
  customization?: localDashboardCustomizationSettings;
}
export default function Links({
  data,
  isPreview,
  customization,
}: AffiliateLinkProps) {
  const columns: ColumnDef<AffiliateLinkWithStats>[] = [
    {
      accessorKey: "fullUrl",
      header: () => (
        <span
          style={{
            color: customization?.tableHeaderTextColor || undefined,
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
          ? customization?.tableIconHoverColor || "#2563eb"
          : isHovered
            ? customization?.tableIconHoverColor || "#2563eb"
            : customization?.tableIconColor || "";

        const iconBgColor = copied
          ? "transparent"
          : isHovered
            ? customization?.tableIconHoverBackgroundColor || "#dbeafe"
            : "transparent";
        return (
          <div
            className="flex items-center"
            style={{
              color: customization?.tableRowSecondaryTextColor || undefined,
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
            color: customization?.tableHeaderTextColor || undefined,
          }}
        >
          Clicks
        </span>
      ),
      cell: ({ row }) => (
        <div
          style={{
            color: customization?.tableRowTertiaryTextColor || undefined,
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
            color: customization?.tableHeaderTextColor || undefined,
          }}
        >
          Sales
        </span>
      ),
      cell: ({ row }) => (
        <div
          style={{
            color: customization?.tableRowTertiaryTextColor || undefined,
          }}
        >
          {row.getValue("sales")}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: () => (
        <span
          style={{
            color: customization?.tableHeaderTextColor || undefined,
          }}
        >
          Created
        </span>
      ),
      cell: ({ row }) => (
        <div
          style={{
            color: customization?.tableRowTertiaryTextColor || undefined,
          }}
        >
          {new Date(row.getValue("createdAt")).toLocaleDateString()}
        </div>
      ),
    },
  ];
  const [isFakeLoading, setIsFakeLoading] = useState(false);
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
      <div className="flex justify-between items-center">
        <div>
          <h1
            className="text-3xl font-bold"
            style={{
              color: customization?.headerNameColor || undefined,
            }}
          >
            Affiliate Links
          </h1>
          <p
            className="text-muted-foreground"
            style={{
              color: customization?.headerDescColor || undefined,
            }}
          >
            Track your referral links and their performance
          </p>
        </div>
        <Button
          onClick={handleCreate}
          disabled={mutation.isPending || isFakeLoading}
          style={{
            backgroundColor:
              mutation.isPending || isFakeLoading
                ? customization?.buttonDisabledBackgroundColor || undefined
                : customization?.buttonBackgroundColor || undefined,
            color:
              mutation.isPending || isFakeLoading
                ? customization?.buttonDisabledTextColor || undefined
                : customization?.buttonTextColor || undefined,
          }}
        >
          {mutation.isPending || isFakeLoading
            ? "Creating..."
            : "Create New Link"}
        </Button>
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
            Link Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No links found.
            </div>
          ) : (
            <div
              className="rounded-md border"
              style={{
                borderColor: customization?.tableBorderColor || undefined,
                borderWidth: "1px",
                borderStyle: "solid",
              }}
            >
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          style={{
                            borderBottom: `1px solid ${customization?.tableBorderColor || "#e5e7eb"}`,
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
                  {table.getRowModel().rows.map((row, idx, allRows) => (
                    <TableRow
                      key={row.id}
                      style={{
                        borderBottom:
                          idx !== allRows.length - 1
                            ? `1px solid ${customization?.tableBorderColor || "#e5e7eb"}`
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
