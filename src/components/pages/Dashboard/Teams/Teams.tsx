"use client"

import React, { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TableView } from "@/components/ui-custom/TableView"
import {
  getCoreRowModel,
  useReactTable,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table"
import { AppDialog } from "@/components/ui-custom/AppDialog"
import { useAppMutation } from "@/hooks/useAppMutation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import {
  getTeams,
  inviteTeamMember,
  toggleTeamStatus,
  deleteTeamMember,
} from "@/app/(organization)/organization/[orgId]/dashboard/teams/action"
import { InputField, TextareaField } from "@/components/Auth/FormFields"
import { useQueryFilter } from "@/hooks/useQueryFilter"
import { useAppQuery } from "@/hooks/useAppQuery"
import { TeamsColumns } from "@/components/pages/Dashboard/Teams/TeamsColumns"
import { TableTop } from "@/components/ui-custom/TableTop"
import PaginationControls from "@/components/ui-custom/PaginationControls"
import { useQueryClient } from "@tanstack/react-query"

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
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    id: string | null
  }>({
    open: false,
    id: null,
  })
  const [toggleDialog, setToggleDialog] = useState<{
    open: boolean
    id: string | null
    active: boolean
  }>({ open: false, id: null, active: false })
  const [openInvite, setOpenInvite] = useState(false)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const queryClient = useQueryClient()
  const { filters, setFilters } = useQueryFilter()

  // Fetch teams
  const {
    data: searchData,
    error: searchError,
    isPending: searchPending,
  } = useAppQuery(
    ["org-teams", orgId, filters.offset, filters.email],
    getTeams,
    [orgId, filters.offset, filters.email],
    { enabled: !!orgId }
  )

  // Invite mutation
  const inviteMutation = useAppMutation(inviteTeamMember, {
    onSuccess: (res) => {
      if (res.ok) {
        setOpenInvite(false)
        form.reset()
      }
    },
  })

  // Activate/deactivate mutation
  const toggleMutation = useAppMutation(toggleTeamStatus, {
    onSuccess: (_, variables) => {
      queryClient
        .invalidateQueries({
          queryKey: ["org-teams", variables.orgId],
        })
        .then(() => console.log("Invalidated teams query"))
    },
  })

  // Delete mutation
  const deleteMutation = useAppMutation(deleteTeamMember, {
    onSuccess: (_, variables) => {
      setDeleteDialog({ open: false, id: null })
      queryClient
        .invalidateQueries({
          queryKey: ["org-teams", variables.orgId],
        })
        .then(() => console.log("Invalidated teams query"))
    },
  })

  const form = useForm<z.infer<typeof inviteSchema>>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: "", title: "", description: "" },
  })

  const onSubmit = (data: z.infer<typeof inviteSchema>) => {
    inviteMutation.mutate({ ...data, orgId })
  }
  const confirmDelete = () => {
    if (deleteDialog.id) deleteMutation.mutate({ id: deleteDialog.id, orgId })
  }
  const confirmToggle = () => {
    if (toggleDialog.id) {
      toggleMutation.mutate({
        id: toggleDialog.id,
        active: !toggleDialog.active,
        orgId,
      })
      setToggleDialog({ open: false, id: null, active: false })
    }
  }
  const columns = useMemo(
    () =>
      TeamsColumns({
        onToggle: (id, active) => setToggleDialog({ open: true, id, active }),
        onDelete: (id) => setDeleteDialog({ open: true, id }),
      }),
    []
  )
  const tableData = searchData ?? []
  const table = useReactTable({
    data: tableData,
    columns,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
    manualPagination: true,
    state: {
      columnFilters,
      columnVisibility,
      rowSelection,
    },
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
          <TableTop
            table={table}
            filters={{ email: filters.email }}
            onOrderChange={() => {}}
            onEmailChange={(email) => setFilters({ email: email || undefined })}
            affiliate={affiliate}
            hideOrder
          />
          <TableView
            isPending={searchPending}
            error={searchError}
            table={table}
            columns={columns}
            affiliate={affiliate}
            isPreview={false}
            tableEmptyText="No team members found."
          />
          <PaginationControls
            offset={filters.offset}
            tableDataLength={tableData.length}
            setFilters={setFilters}
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
        confirmLoading={inviteMutation.isPending}
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
        confirmLoading={deleteMutation.isPending}
        onConfirm={confirmDelete}
        affiliate={affiliate}
      >
        <p className="text-sm text-muted-foreground">
          Deleting a member will permanently remove their access.
        </p>
      </AppDialog>
      <AppDialog
        open={toggleDialog.open}
        onOpenChange={(open) =>
          setToggleDialog({
            open,
            id: open ? toggleDialog.id : null,
            active: false,
          })
        }
        title={
          toggleDialog.active
            ? "Deactivate Team Member"
            : "Activate Team Member"
        }
        description={
          toggleDialog.active
            ? "Are you sure you want to deactivate this team member?"
            : "Are you sure you want to activate this team member?"
        }
        confirmText={toggleDialog.active ? "Yes, Deactivate" : "Yes, Activate"}
        confirmLoading={toggleMutation.isPending}
        onConfirm={confirmToggle}
        affiliate={affiliate}
      >
        <p className="text-sm text-muted-foreground">
          This will immediately {toggleDialog.active ? "disable" : "enable"} the
          member’s access.
        </p>
      </AppDialog>
    </div>
  )
}
