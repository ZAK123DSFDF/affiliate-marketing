import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";

type TableLoadingProps<TData> = {
  columns: ColumnDef<TData, any>[];
};

export const TableLoading = <TData,>({ columns }: TableLoadingProps<TData>) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableBody>
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
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
  );
};
