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
    <div
      className="
        flex flex-col gap-4 py-4
        sm:flex-row md:items-center sm:justify-between
      "
    >
      {/* Page text (hidden under 425px) */}
      <div
        className="
          text-sm text-muted-foreground text-center
          md:text-left
        "
      >
        Showing page {currentPage} {tableDataLength < 10 ? "(Last page)" : ""}
      </div>

      {/* Buttons */}
      <div
        className="
          flex flex-row items-center justify-center gap-4
        "
      >
        {/* Previous */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFilters({ offset: Math.max(1, currentPage - 1) })}
          disabled={!offset || offset <= 1}
          className="
            gap-1
            max-[425px]:px-3
          "
        >
          <ChevronLeft className="h-4 w-4" />
          {/* Hide text on <=425px */}
          <span className="max-[425px]:hidden">Previous</span>
        </Button>

        {/* Page number (no label on <=425px) */}
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground ">Page</span>

          <div className="min-w-[32px] h-8 px-2 flex items-center justify-center text-sm font-medium border rounded-md bg-background">
            {currentPage}
          </div>
        </div>

        {/* Next */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFilters({ offset: currentPage + 1 })}
          disabled={tableDataLength < 10}
          className="
            gap-1
            max-[425px]:px-3
          "
        >
          {/* Hide text on <=425px */}
          <span className="hidden max-[425px]:inline"></span>
          <span className="max-[425px]:hidden">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
