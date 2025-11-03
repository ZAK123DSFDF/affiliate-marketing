"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Power, PowerOff, Trash2 } from "lucide-react"

interface TeamRow {
  id: string
  email: string
  isActive: boolean
  orgId: string
}

export const TeamsColumns = ({
  onToggle,
  onDelete,
}: {
  onToggle: (id: string, isActive: boolean) => void
  onDelete: (id: string) => void
}): ColumnDef<TeamRow>[] => [
  {
    accessorKey: "email",
    header: "Team Email",
    cell: ({ row }) => (
      <div className="font-medium text-sm">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean
      return (
        <Badge
          variant="outline"
          className={`px-2 py-1 rounded-full text-xs border-2 ${
            isActive
              ? "border-green-500 text-green-600 bg-green-50"
              : "border-red-500 text-red-600 bg-red-50"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const { id, isActive } = row.original

      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="min-w-[110px]"
            onClick={() => onToggle(id, isActive)}
          >
            {isActive ? (
              <>
                <PowerOff className="w-4 h-4 mr-1" /> Deactivate
              </>
            ) : (
              <>
                <Power className="w-4 h-4 mr-1" /> Activate
              </>
            )}
          </Button>

          <Button variant="destructive" size="sm" onClick={() => onDelete(id)}>
            <Trash2 className="w-4 h-4 mr-1" /> Delete
          </Button>
        </div>
      )
    },
  },
]
