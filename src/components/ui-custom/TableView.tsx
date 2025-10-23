"use client"

import React from "react"
import { useAtomValue } from "jotai"
import { Table, ColumnDef } from "@tanstack/react-table"
import { tableCustomizationAtom } from "@/store/DashboardCustomizationAtom"
import { TableLoading } from "@/components/ui-custom/TableLoading"
import { TableContent } from "@/components/ui-custom/TableContent"

interface TableViewProps<TData> {
  isPending: boolean
  error?: string
  table: Table<TData>
  columns: ColumnDef<TData, any>[]
  affiliate: boolean
  isPreview?: boolean
  tableEmptyText?: string
}

export function TableView<TData>({
  isPending,
  error,
  table,
  columns,
  affiliate,
  isPreview,
  tableEmptyText = "No data available.",
}: TableViewProps<TData>) {
  const { tableEmptyTextColor, tableErrorTextColor } = useAtomValue(
    tableCustomizationAtom
  )

  if (isPending) {
    return <TableLoading affiliate={affiliate} columns={columns} />
  }

  if (error) {
    return (
      <div
        className="text-center py-6 text-red-500"
        style={{
          color: affiliate ? tableErrorTextColor : undefined,
        }}
      >
        {error}
      </div>
    )
  }

  if (table.getRowModel().rows.length === 0) {
    return (
      <div
        className="text-center py-6 text-muted-foreground"
        style={{
          color: affiliate ? tableEmptyTextColor : undefined,
        }}
      >
        {tableEmptyText}
      </div>
    )
  }

  return (
    <TableContent table={table} affiliate={affiliate} isPreview={isPreview} />
  )
}
