import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { flexRender, Table as ReactTable } from "@tanstack/react-table";
import React, { useState } from "react";
import { useTableCustomizationOption } from "@/hooks/useDashboardCustomization";

type TableProps<TData> = {
  table: ReactTable<TData>;
  affiliate: boolean;
  isPreview?: boolean;
};
export const TableContent = <TData,>({
  table,
  affiliate,
  isPreview,
}: TableProps<TData>) => {
  const dashboardTable = useTableCustomizationOption();
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  return (
    <div
      className={cn("rounded-md border overflow-hidden", isPreview && "mb-4")}
      style={{
        borderColor:
          (affiliate && dashboardTable.tableBorderColor) || undefined,
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
                  ? (affiliate && dashboardTable.tableHoverBackgroundColor) ||
                    "#f9fafb"
                  : undefined,
                transition: "background-color 0.2s ease",
              }}
            >
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  style={{
                    borderBottom: `1px solid ${(affiliate && dashboardTable.tableBorderColor) || "#e5e7eb"}`,
                    color:
                      (affiliate && dashboardTable.tableHeaderTextColor) ||
                      undefined,
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
                    ? (affiliate && dashboardTable.tableHoverBackgroundColor) ||
                      defaultHoverBg
                    : undefined,
                  transition: "background-color 0.2s ease",
                  borderBottom:
                    idx !== allRows.length - 1
                      ? `1px solid ${(affiliate && dashboardTable.tableBorderColor) || "#e5e7eb"}`
                      : "none",
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
