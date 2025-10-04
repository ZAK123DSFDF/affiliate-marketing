"use client"

import { useRef, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAtomValue } from "jotai"

import {
  deleteOrganizationLogo,
  updateOrganizationLogo,
} from "@/app/(seller)/create-company/action"
import { FileUploadRef } from "@/components/ui-custom/FileUploadRef"
import { uploadsAtom } from "@/store/UploadAtom"
import { AppDialog } from "@/components/ui-custom/AppDialog"
import { SingleUploadProgress } from "@/components/ui-custom/SingleUploadProgress"
type LogoUploadProps = {
  value: string | null
  onChange: (url: string | null) => void
  affiliate: boolean
  orgId?: string
  orgName?: string
  mode?: "default" | "avatar" // 👈 new
}
export function LogoUpload({
  value,
  onChange,
  affiliate,
  orgId,
  orgName,
  mode = "default",
}: LogoUploadProps) {
  const fileUploadRef = useRef<FileUploadRef>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const uploads = useAtomValue(uploadsAtom)

  const deleteLogoMutation = useMutation({
    mutationFn: async () => {
      await deleteOrganizationLogo(value!)
      if (orgId) {
        await updateOrganizationLogo({ orgId, logoUrl: null })
      }
    },
    onSuccess: () => {
      onChange(null)
    },
  })

  const handleButtonClick = () => {
    // 👇 don’t open dialog yet, only open if user actually selects a file
    fileUploadRef.current?.openFilePicker()
  }

  const handleNewLogo = async (newUrl: string) => {
    const oldUrl = value
    onChange(newUrl)
    if (oldUrl) {
      deleteOrganizationLogo(oldUrl)
        .then(() => console.log("Old logo cleaned up successfully"))
        .catch((err) => console.error("Failed to clean up old logo:", err))
    }

    if (orgId) {
      try {
        await updateOrganizationLogo({ orgId, logoUrl: newUrl })
      } catch (err) {
        console.error("Failed to save logo to DB:", err)
      }
    }
    // ✅ Auto-close dialog after success
    setTimeout(() => setDialogOpen(false), 600)
  }

  // Get latest file (only show one)
  const files = uploads["company-logo"]?.files ?? []
  const latestFile = files.length > 0 ? files[files.length - 1] : null
  const errorMessage = uploads["company-logo"]?.errorMessage ?? null

  return (
    <div className="flex flex-col items-center space-y-2">
      <div
        className="relative group cursor-pointer"
        onClick={mode === "avatar" ? handleButtonClick : undefined}
      >
        {value ? (
          <img
            src={value}
            alt="Company Logo"
            className="h-16 w-16 rounded-full object-contain bg-muted"
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-xl font-semibold text-muted-foreground">
            {orgName?.charAt(0).toUpperCase() ?? "?"}
          </div>
        )}

        {/* ❌ delete button stays */}
        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              deleteLogoMutation.mutate()
            }}
            disabled={deleteLogoMutation.isPending}
            className="absolute -top-2 -right-2 bg-white rounded-full shadow p-1 hover:bg-red-100"
          >
            {deleteLogoMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin text-red-500" />
            ) : (
              <X className="h-4 w-4 text-red-500" />
            )}
          </button>
        )}
      </div>

      {/* 👇 Only show button in default mode */}
      {mode === "default" && (
        <Button type="button" variant="outline" onClick={handleButtonClick}>
          {value ? "Change Logo" : "Upload Logo"}
        </Button>
      )}
      {/* Hidden uploader */}
      <div className="absolute w-0 h-0 overflow-hidden opacity-0 pointer-events-none">
        <FileUploadRef
          ref={fileUploadRef}
          uploadId="company-logo"
          type="image"
          affiliate={affiliate}
          maxFiles={1}
          onFileSelected={() => setDialogOpen(true)} // 👈 open only if user selects a file
          onUploadSuccess={(_, __, ___, url) => {
            handleNewLogo(url).then(() =>
              console.log("Logo updated successfully")
            )
          }}
        />
      </div>

      {/* Progress dialog */}
      <AppDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Uploading Logo"
        description="Please wait while your logo is uploading…"
        affiliate={affiliate}
        showFooter={false}
      >
        {latestFile && (
          <SingleUploadProgress file={latestFile} errorMessage={errorMessage} />
        )}
      </AppDialog>
    </div>
  )
}
