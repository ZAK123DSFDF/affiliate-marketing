import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import * as React from "react"
import { Table as ReactTable } from "@tanstack/react-table"
import { OrderDir, OrderBy } from "@/lib/types/orderTypes"
import OrderSelect from "@/components/ui-custom/OrderSelect"
import { SearchInput } from "@/components/ui-custom/SearchInput"
type TableProps<TData> = {
  table: ReactTable<TData>
  filters: { orderBy?: OrderBy; orderDir?: OrderDir; email?: string }
  onOrderChange: (orderBy?: OrderBy, orderDir?: OrderDir) => void
  onEmailChange: (email: string) => void
  affiliate: boolean
}

export const TableTop = <TData,>({
  table,
  filters,
  onOrderChange,
  onEmailChange,
  affiliate,
}: TableProps<TData>) => {
  return (
    <div className="flex items-center py-4">
      <div className="flex items-center space-x-2">
        <SearchInput
          value={filters.email ?? ""}
          onChange={onEmailChange}
          placeholder="Filter emails..."
        />
        <OrderSelect
          value={filters}
          onChange={onOrderChange}
          affiliate={affiliate}
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-auto">
            Columns <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              )
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
