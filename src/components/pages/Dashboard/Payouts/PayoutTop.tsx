import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import Payouts from "@/components/pages/Dashboard/Payouts/Payouts"

const payoutData = [
  {
    id: "1",
    email: "affiliate1@example.com",
    sales: 12,
    unpaid: 316,
    paid: 1200,
    status: "pending",
  },
  {
    id: "2",
    email: "affiliate2@example.com",
    sales: 8,
    unpaid: 242,
    paid: 950,
    status: "paid",
  },
  {
    id: "3",
    email: "affiliate3@example.com",
    sales: 22,
    unpaid: 837,
    paid: 2100,
    status: "paid",
  },
]

export default function PayoutPage() {
  return (
    <div className="space-y-6">
      {/* Affiliate Payouts Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Affiliate Payouts</CardTitle>
            <Button variant="outline">Export Data</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Unpaid ($)</TableHead>
                <TableHead>Paid ($)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payoutData.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell className="font-medium">{payout.email}</TableCell>
                  <TableCell>{payout.sales}</TableCell>
                  <TableCell>{payout.unpaid.toFixed(2)}</TableCell>
                  <TableCell>{payout.paid.toFixed(2)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        payout.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {payout.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Initiate Payout</DropdownMenuItem>
                        <DropdownMenuItem>Export</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* PayPal Mass Payout Section */}
      <Card>
        <CardHeader>
          <CardTitle>Mass Payout Processing</CardTitle>
        </CardHeader>
        <CardContent>
          <Payouts />
        </CardContent>
      </Card>
    </div>
  )
}
