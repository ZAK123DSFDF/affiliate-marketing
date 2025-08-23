"use client";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import * as React from "react";
import { Table as ReactTable } from "@tanstack/react-table";
import OrderSelect from "@/components/ui-custom/OrderSelect";
import { SearchInput } from "@/components/ui-custom/SearchInput";
import { useQueryFilter } from "@/hooks/useQueryFilter";

type TableProps<TData> = {
  table: ReactTable<TData>;
  affiliate: boolean;
};

export const TableTop = <TData,>({ table, affiliate }: TableProps<TData>) => {
  const { filters, setFilters } = useQueryFilter();

  return (
    <div className="flex items-center py-4">
      <div className="flex items-center space-x-2">
        {/* Email search with debounce */}
        <SearchInput
          value={filters.email ?? ""}
          onChange={(email) => setFilters({ email: email || undefined })}
          placeholder="Filter emails..."
        />

        {/* Order By + Direction */}
        <OrderSelect
          value={{ orderBy: filters.orderBy, orderDir: filters.orderDir }}
          onChange={(orderBy, orderDir) => setFilters({ orderBy, orderDir })}
          affiliate={affiliate}
        />
      </div>

      {/* Column visibility toggle */}
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
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
