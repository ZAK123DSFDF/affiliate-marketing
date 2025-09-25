import { ColumnDef } from "@tanstack/react-table"
import { AffiliateLinkWithStats } from "@/lib/types/affiliateLinkWithStats"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"
import { useAtomValue } from "jotai"
import { tableCustomizationAtom } from "@/store/DashboardCustomizationAtom"

export const LinksColumns = (
  affiliate: boolean
): ColumnDef<AffiliateLinkWithStats>[] => {
  const dashboardTable = useAtomValue(tableCustomizationAtom)
  return [
    {
      accessorKey: "fullUrl",
      header: () => (
        <span
          style={{
            color:
              (affiliate && dashboardTable.tableHeaderTextColor) || undefined,
          }}
        >
          Affiliate Link
        </span>
      ),
      cell: ({ row }) => {
        const url: string = row.getValue("fullUrl")
        const [isHovered, setIsHovered] = useState(false)
        const [copied, setCopied] = useState(false)

        const handleCopy = () => {
          navigator.clipboard.writeText(url).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 1000)
          })
        }
        const iconColor = copied
          ? (affiliate && dashboardTable.tableIconHoverColor) || "#2563eb"
          : isHovered
            ? (affiliate && dashboardTable.tableIconHoverColor) || "#2563eb"
            : (affiliate && dashboardTable.tableIconColor) || ""

        const iconBgColor = copied
          ? "transparent"
          : isHovered
            ? (affiliate && dashboardTable.tableIconHoverBackgroundColor) ||
              "#dbeafe"
            : "transparent"
        return (
          <div
            className="flex items-center"
            style={{
              color:
                (affiliate && dashboardTable.tableRowSecondaryTextColor) ||
                undefined,
            }}
          >
            <span className="break-all">{url}</span>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={handleCopy}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="ml-5 flex items-center gap-[2px] text-xs rounded-md transition-colors"
              style={{
                color: iconColor,
                backgroundColor: iconBgColor,
              }}
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" style={{ color: iconColor }} />
                  <span style={{ color: iconColor }}>Copied</span>
                </>
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </Button>
          </div>
        )
      },
    },
    {
      accessorKey: "clicks",
      header: () => (
        <span
          style={{
            color:
              (affiliate && dashboardTable.tableHeaderTextColor) || undefined,
          }}
        >
          Clicks
        </span>
      ),
      cell: ({ row }) => (
        <div
          style={{
            color:
              (affiliate && dashboardTable.tableRowTertiaryTextColor) ||
              undefined,
          }}
        >
          {row.getValue("clicks")}
        </div>
      ),
    },
    {
      accessorKey: "sales",
      header: () => (
        <span
          style={{
            color:
              (affiliate && dashboardTable.tableHeaderTextColor) || undefined,
          }}
        >
          Sales
        </span>
      ),
      cell: ({ row }) => (
        <div
          style={{
            color:
              (affiliate && dashboardTable.tableRowTertiaryTextColor) ||
              undefined,
          }}
        >
          {row.getValue("sales")}
        </div>
      ),
    },
    {
      accessorKey: "conversionRate",
      header: () => (
        <span
          style={{
            color:
              (affiliate && dashboardTable.tableHeaderTextColor) || undefined,
          }}
        >
          Conversion Rate
        </span>
      ),
      cell: ({ row }) => (
        <div
          style={{
            color:
              (affiliate && dashboardTable.tableRowTertiaryTextColor) ||
              undefined,
          }}
        >
          {row.getValue("conversionRate")}%
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: () => (
        <span
          style={{
            color:
              (affiliate && dashboardTable.tableHeaderTextColor) || undefined,
          }}
        >
          Created
        </span>
      ),
      cell: ({ row }) => (
        <div
          style={{
            color:
              (affiliate && dashboardTable.tableRowTertiaryTextColor) ||
              undefined,
          }}
        >
          {new Date(row.getValue("createdAt")).toLocaleDateString()}
        </div>
      ),
    },
  ]
}
