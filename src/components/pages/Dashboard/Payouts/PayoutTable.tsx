"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowUpDown,
  ChevronDown,
  Download,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  getAffiliatePayouts,
  getUnpaidMonths,
} from "@/app/seller/[orgId]/dashboard/payout/action";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import MonthSelect from "@/components/ui-custom/MonthSelect";
import { useQuery } from "@tanstack/react-query";
import { AffiliatePayout } from "@/lib/types/affiliatePayout";
import UnpaidPicker from "@/components/ui-custom/UnpaidPicker";
import { UnpaidMonth } from "@/lib/types/unpaidMonth";

export const columns: ColumnDef<AffiliatePayout>[] = [
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    id: "links",
    header: "Links",
    cell: ({ row }) => {
      const links = row.original.links;
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="link" className="p-0 text-blue-600 underline">
              View Links
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Links</DialogTitle>
            </DialogHeader>
            <ul className="space-y-2">
              {links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </DialogContent>
        </Dialog>
      );
    },
  },
  {
    accessorKey: "visitors",
    header: "Visitors",
    cell: ({ row }) => <div>{row.getValue("visitors")}</div>,
  },
  {
    accessorKey: "sales",
    header: "Sales",
    cell: ({ row }) => <div>{row.getValue("sales")}</div>,
  },
  {
    accessorKey: "commission",
    header: () => <div className="text-right">Commission</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("commission"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "paid",
    header: () => <div className="text-right">Paid</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("paid"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "unpaid",
    header: () => <div className="text-right">Unpaid</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("unpaid"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const unpaid = row.original.unpaid;
      const status = unpaid > 0 ? "pending" : "paid";
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            status === "paid"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {status}
        </span>
      );
    },
  },
];
interface AffiliatesTablePayoutProps {
  data: AffiliatePayout[];
  orgId: string;
}
export default function PayoutTable({
  data,
  orgId,
}: AffiliatesTablePayoutProps) {
  const [monthYear, setMonthYear] = useState<{
    month?: number;
    year?: number;
  }>({});
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [unpaidMonths, setUnpaidMonths] = useState<UnpaidMonth[]>([]);
  const [selectedMonths, setSelectedMonths] = useState<UnpaidMonth[]>([]);
  /* optional: refetch when month changes */
  const router = useRouter();
  const pathname = usePathname();

  const onMonthChange = (m?: number, y?: number) => {
    setMonthYear({ month: m, year: y });
    const qs = m && y ? `?m=${m}&y=${y}` : "";
    router.replace(`${pathname}${qs}`);
    // You could also trigger a client‑side fetch here instead of full reload
  };
  const { data: live, isPending } = useQuery({
    queryKey: ["payouts", orgId, monthYear.month, monthYear.year],
    queryFn: () =>
      getAffiliatePayouts(orgId, monthYear.month, monthYear.year).then((r) =>
        r.ok ? r.data : [],
      ),
  });
  const { data: unpaidMonthData, isPending: pendingMonth } = useQuery({
    queryKey: ["unpaid-months", orgId],
    queryFn: () =>
      getUnpaidMonths(orgId).then((res) => (res.ok ? res.data : [])),
    enabled: isDialogOpen && !!orgId, // ✅ only fetch when modal opens
  });
  useEffect(() => {
    if (unpaidMonthData) {
      setUnpaidMonths(unpaidMonthData);
    }
  }, [unpaidMonthData]);
  const tableData = live ?? data;
  /* CSV helper */
  const csv = React.useMemo(() => {
    const header = "Email,Sales,Unpaid,Paid,Commission,Status,Links\n";
    return (
      header +
      tableData
        .map(
          (r) =>
            `${r.email},${r.sales},${r.unpaid.toFixed(
              2,
            )},${r.paid.toFixed(2)},${r.commission.toFixed(2)},${
              r.unpaid > 0 ? "pending" : "paid"
            },"${r.links.join(" ")}"`,
        )
        .join("\n")
    );
  }, [tableData]);

  const downloadCSV = () => {
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payouts_${monthYear.year ?? "all"}_${
      monthYear.month ?? "all"
    }.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <div>
            <h1 className="text-3xl font-bold">Payments</h1>
            <p className="text-muted-foreground">Manage your payment records</p>
          </div>
        </div>
        <Button>Add Payment</Button>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <MonthSelect value={monthYear} onChange={onMonthChange} />
        </div>
        <Button variant="outline" onClick={() => setDialogOpen(true)}>
          Unpaid Months
        </Button>

        <UnpaidPicker
          open={isDialogOpen}
          onOpenChange={setDialogOpen}
          months={unpaidMonths}
          selection={selectedMonths}
          setSelection={setSelectedMonths}
          loading={pendingMonth}
        />
        <div className="flex gap-2">
          <Button variant="outline" onClick={downloadCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button
            onClick={() =>
              window.open("https://www.paypal.com/mep/payoutsweb", "_blank")
            }
          >
            Mass Payout
          </Button>
        </div>
      </div>
      {/* Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter emails..."
              value={
                (table.getColumn("email")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("email")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
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
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isPending ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-600" />
                        <span className="text-sm text-muted-foreground">
                          Loading...
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
