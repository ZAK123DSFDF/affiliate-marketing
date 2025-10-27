"use client"

import React, { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TableView } from "@/components/ui-custom/TableView"
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Trash2, Power, PowerOff, Loader2 } from "lucide-react"
import { AppDialog } from "@/components/ui-custom/AppDialog"
import { useAppMutation } from "@/hooks/useAppMutation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import { inviteTeamMember } from "@/app/(organization)/organization/[orgId]/dashboard/teams/action"
import { InputField, TextareaField } from "@/components/Auth/FormFields"

const initialTeams = [
  { id: 1, email: "alice@example.com", isActive: true },
  { id: 2, email: "bob@example.com", isActive: false },
  { id: 3, email: "charlie@example.com", isActive: true },
]

const inviteSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
})

export default function Teams({
  orgId,
  affiliate = false,
}: {
  orgId: string
  affiliate: boolean
}) {
  const [teams, setTeams] = useState(initialTeams)
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: null as number | null,
  })
  const [openInvite, setOpenInvite] = useState(false)

  const form = useForm<z.infer<typeof inviteSchema>>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: "", title: "", description: "" },
  })

  const mutation = useAppMutation(inviteTeamMember, {
    onSuccess: () => {
      setOpenInvite(false)
      form.reset()
    },
  })

  const onSubmit = (data: z.infer<typeof inviteSchema>) => {
    mutation.mutate({ ...data, orgId })
  }

  const handleActivateToggle = async (id: number) => {
    setLoadingId(id)
    await new Promise((r) => setTimeout(r, 1000))
    setTeams((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t))
    )
    setLoadingId(null)
  }

  const handleDelete = (id: number) => {
    setDeleteDialog({ open: true, id })
  }

  const confirmDelete = () => {
    if (deleteDialog.id != null) {
      setTeams((prev) => prev.filter((t) => t.id !== deleteDialog.id))
    }
    setDeleteDialog({ open: false, id: null })
  }

  const columns: ColumnDef<(typeof initialTeams)[0]>[] = useMemo(
    () => [
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
          const isLoading = loadingId === id

          return (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="min-w-[110px]"
                onClick={() => handleActivateToggle(id)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : isActive ? (
                  <>
                    <PowerOff className="w-4 h-4 mr-1" /> Deactivate
                  </>
                ) : (
                  <>
                    <Power className="w-4 h-4 mr-1" /> Activate
                  </>
                )}
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(id)}
              >
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </Button>
            </div>
          )
        },
      },
    ],
    [loadingId]
  )

  const table = useReactTable({
    data: teams,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Teams</h1>
          <p className="text-muted-foreground">
            Manage your teams and invitations
          </p>
        </div>
        <Button onClick={() => setOpenInvite(true)}>Invite Member</Button>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <TableView
            isPending={false}
            error=""
            table={table}
            columns={columns}
            affiliate={affiliate}
            isPreview={false}
            tableEmptyText="No team members found."
          />
        </CardContent>
      </Card>

      {/* Invite Dialog */}
      <AppDialog
        open={openInvite}
        onOpenChange={setOpenInvite}
        title="Invite a Team Member"
        description="Send an invitation email to add a new member to your organization."
        confirmText="Send Invite"
        confirmLoading={mutation.isPending}
        onConfirm={form.handleSubmit(onSubmit)}
        affiliate={affiliate}
      >
        <Form {...form}>
          <form className="space-y-4">
            <InputField
              control={form.control}
              name="email"
              label="Email"
              placeholder="user@example.com"
              type="email"
              affiliate={affiliate}
            />

            <InputField
              control={form.control}
              name="title"
              label="Title"
              placeholder="Invitation title"
              type="text"
              affiliate={affiliate}
            />

            <TextareaField
              control={form.control}
              name="description"
              label="Message"
              placeholder="Write your invitation message..."
              rows={4}
              affiliate={affiliate}
            />
          </form>
        </Form>
      </AppDialog>

      {/* Delete Confirmation Dialog */}
      <AppDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog({ open, id: open ? deleteDialog.id : null })
        }
        title="Delete Team Member"
        description="Are you sure you want to delete this team member? This action cannot be undone."
        confirmText="Yes, Delete"
        confirmLoading={false}
        onConfirm={confirmDelete}
        affiliate={affiliate}
      >
        <p className="text-sm text-muted-foreground">
          Deleting a member will permanently remove their access.
        </p>
      </AppDialog>
    </div>
  )
}
