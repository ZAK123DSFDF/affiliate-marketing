// app/dashboard/page.tsx
"use client";
import React from "react";
import {
  Activity,
  ArrowUpRight,
  DollarSign,
  Link as LinkIcon,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { SidebarTrigger } from "@/components/ui/sidebar";

const performanceData = [
  { month: "Jan", revenue: 1200, conversions: 12 },
  { month: "Feb", revenue: 1900, conversions: 18 },
  { month: "Mar", revenue: 1300, conversions: 14 },
  { month: "Apr", revenue: 2100, conversions: 21 },
  { month: "May", revenue: 2500, conversions: 25 },
  { month: "Jun", revenue: 2300, conversions: 23 },
  { month: "Jul", revenue: 2800, conversions: 28 },
];

const recentReferrals = [
  {
    id: 1,
    customer: "Alex Johnson",
    date: "2023-07-15",
    status: "Converted",
    amount: "$89",
  },
  {
    id: 2,
    customer: "Sarah Williams",
    date: "2023-07-14",
    status: "Pending",
    amount: "-",
  },
  {
    id: 3,
    customer: "Michael Brown",
    date: "2023-07-12",
    status: "Converted",
    amount: "$149",
  },
  {
    id: 4,
    customer: "Emily Davis",
    date: "2023-07-10",
    status: "Converted",
    amount: "$79",
  },
  {
    id: 5,
    customer: "Robert Wilson",
    date: "2023-07-08",
    status: "Expired",
    amount: "-",
  },
];

const chartConfig = {
  revenue: {
    label: "Revenue",
    theme: {
      light: "#8b5cf6",
      dark: "#a78bfa",
    },
  },
  conversions: {
    label: "Conversions",
    theme: {
      light: "#22c55e",
      dark: "#4ade80",
    },
  },
};

export default function DashboardPage() {
  const [chartTimeframe, setChartTimeframe] = React.useState("monthly");
  return (
    <div className="flex flex-col gap-6">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <div>
            <h1 className="text-3xl font-bold">Affiliate Dashboard</h1>
            <p className="text-muted-foreground">
              Track your affiliate performance and earnings
            </p>
          </div>
        </div>
        <Button>Create New Link</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <DollarSign size={24} />
              </div>
              <ArrowUpRight className="text-green-500" size={20} />
            </div>
            <h3 className="text-2xl font-bold mt-4">$3,240</h3>
            <p className="text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Users size={24} />
              </div>
              <ArrowUpRight className="text-green-500" size={20} />
            </div>
            <h3 className="text-2xl font-bold mt-4">68</h3>
            <p className="text-muted-foreground">Total Referrals</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <LinkIcon size={24} />
              </div>
              <ArrowUpRight className="text-green-500" size={20} />
            </div>
            <h3 className="text-2xl font-bold mt-4">12</h3>
            <p className="text-muted-foreground">Active Links</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Activity size={24} />
              </div>
              <ArrowUpRight className="text-green-500" size={20} />
            </div>
            <h3 className="text-2xl font-bold mt-4">22.5%</h3>
            <p className="text-muted-foreground">Conversion Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card className="col-span-1 lg:col-span-4">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Performance Overview</CardTitle>
            <ToggleGroup
              type="single"
              value={chartTimeframe}
              onValueChange={(value) => {
                if (value) setChartTimeframe(value);
              }}
            >
              <ToggleGroupItem value="weekly" aria-label="Weekly view">
                Weekly
              </ToggleGroupItem>
              <ToggleGroupItem value="monthly" aria-label="Monthly view">
                Monthly
              </ToggleGroupItem>
              <ToggleGroupItem value="yearly" aria-label="Yearly view">
                Yearly
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <CardDescription>
            Track your affiliate revenue and conversions over time
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ChartContainer config={chartConfig} className="h-full">
            <AreaChart
              data={performanceData}
              margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient
                  id="colorConversions"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-conversions)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-conversions)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <ChartTooltip
                content={<ChartTooltipContent affiliate={false} />}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-revenue)"
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
              <Area
                type="monotone"
                dataKey="conversions"
                stroke="var(--color-conversions)"
                fillOpacity={1}
                fill="url(#colorConversions)"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Recent Referrals */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Referrals</CardTitle>
          <CardDescription>Your most recent customer referrals</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentReferrals.map((referral) => (
                <TableRow key={referral.id}>
                  <TableCell className="font-medium">
                    {referral.customer}
                  </TableCell>
                  <TableCell>{referral.date}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                      ${
                        referral.status === "Converted"
                          ? "bg-green-100 text-green-800"
                          : referral.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {referral.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {referral.amount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline">View All Referrals</Button>
        </CardFooter>
      </Card>

      {/* Affiliate Links */}
      <Card>
        <CardHeader>
          <CardTitle>Your Affiliate Links</CardTitle>
          <CardDescription>
            Manage and track your affiliate links
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Link Name</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>Conversions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Homepage</TableCell>
                <TableCell>2023-07-01</TableCell>
                <TableCell>245</TableCell>
                <TableCell>18</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    Copy
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Pricing Page</TableCell>
                <TableCell>2023-07-05</TableCell>
                <TableCell>182</TableCell>
                <TableCell>24</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    Copy
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Product Demo</TableCell>
                <TableCell>2023-07-10</TableCell>
                <TableCell>98</TableCell>
                <TableCell>12</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    Copy
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" className="mr-2">
            Manage Links
          </Button>
          <Button>Create New Link</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
