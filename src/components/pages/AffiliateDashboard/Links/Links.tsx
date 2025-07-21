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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { createAffiliateLink } from "@/app/affiliate/[orgId]/dashboard/links/action";
import { toast } from "@/hooks/use-toast";
import { AffiliateLinkWithStats } from "@/lib/types/affiliateLinkWithStats";
import { Copy } from "lucide-react";

const columns: ColumnDef<AffiliateLinkWithStats>[] = [
  {
    accessorKey: "fullUrl",
    header: "Affiliate Link",
    cell: ({ row }) => {
      const url: string = row.getValue("fullUrl");

      const handleCopy = () => {
        navigator.clipboard.writeText(url).then(() => {
          toast({ title: "Copied!", description: url });
        });
      };

      return (
        <div className="flex items-center gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:underline break-all"
          >
            {url}
          </a>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleCopy}
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "clicks",
    header: "Clicks",
    cell: ({ row }) => <div>{row.getValue("clicks")}</div>,
  },
  {
    accessorKey: "sales",
    header: "Sales",
    cell: ({ row }) => <div>{row.getValue("sales")}</div>,
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => (
      <div>{new Date(row.getValue("createdAt")).toLocaleDateString()}</div>
    ),
  },
];
interface AffiliateLinkProps {
  data: AffiliateLinkWithStats[];
  isPreview?: boolean;
}
export default function Links({ data, isPreview }: AffiliateLinkProps) {
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
          <h1 className="text-3xl font-bold">Affiliate Links</h1>
          <p className="text-muted-foreground">
            Track your referral links and their performance
          </p>
        </div>
        <Button
          onClick={handleCreate}
          disabled={mutation.isPending || isFakeLoading}
        >
          {mutation.isPending || isFakeLoading
            ? "Creating..."
            : "Create New Link"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Link Stats</CardTitle>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No links found.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
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
                  {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
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
