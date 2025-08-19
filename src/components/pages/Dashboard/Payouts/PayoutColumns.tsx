import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { AffiliatePayout } from "@/lib/types/affiliateStats";

export const PayoutColumns = (): ColumnDef<AffiliatePayout>[] => {
  return [
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
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
            <DialogContent affiliate={false}>
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
};
