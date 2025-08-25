// components/PaginationControls.tsx
"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationControlsProps {
  offset: number | undefined
  tableDataLength: number
  setFilters: (filters: { offset: number }) => void
}

export default function PaginationControls({
  offset,
  tableDataLength,
  setFilters,
}: PaginationControlsProps) {
  const currentPage = offset ?? 1

  return (
    <div className="flex items-center justify-between space-x-6 py-4">
      <div className="flex-1 text-sm text-muted-foreground">
        Showing page {currentPage} {tableDataLength < 10 ? "(Last page)" : ""}
      </div>

      <div className="flex items-center space-x-2">
        {/* Previous */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFilters({ offset: Math.max(1, currentPage - 1) })}
          disabled={!offset || offset <= 1}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        {/* Current page number */}
        <div className="flex items-center space-x-1">
          <span className="text-sm text-muted-foreground">Page</span>
          <div className="flex items-center justify-center min-w-[32px] h-8 px-2 text-sm font-medium border rounded-md bg-background">
            {currentPage}
          </div>
        </div>

        {/* Next */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFilters({ offset: currentPage + 1 })}
          disabled={tableDataLength < 10}
          className="gap-1"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
