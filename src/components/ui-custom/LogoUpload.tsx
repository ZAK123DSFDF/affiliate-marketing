"use client"

import { useRef } from "react"
import { useMutation } from "@tanstack/react-query"
import { Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FileUpload, FileUploadRef } from "@/components/ui-custom/FileUpload"
import { deleteOrganizationLogo } from "@/app/(seller)/create-company/action"

export function LogoUpload({
  value,
  onChange,
  affiliate,
}: {
  value: string | null
  onChange: (url: string | null) => void
  affiliate: boolean
}) {
  const fileUploadRef = useRef<FileUploadRef>(null)

  const deleteLogoMutation = useMutation({
    mutationFn: () => deleteOrganizationLogo(value!),
    onSuccess: () => {
      onChange(null)
    },
  })

  const handleButtonClick = () => {
    fileUploadRef.current?.openFilePicker()
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      {value ? (
        <div className="relative">
          <img
            src={value}
            alt="Company Logo"
            className="h-24 w-24 rounded-full object-contain bg-muted p-2"
          />
          <button
            type="button"
            onClick={() => deleteLogoMutation.mutate()}
            disabled={deleteLogoMutation.isPending}
            className="absolute -top-2 -right-2 bg-white rounded-full shadow p-1 hover:bg-red-100"
          >
            {deleteLogoMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin text-red-500" />
            ) : (
              <X className="h-4 w-4 text-red-500" />
            )}
          </button>
        </div>
      ) : (
        <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center text-sm text-muted-foreground">
          No Logo
        </div>
      )}

      <Button type="button" variant="outline" onClick={handleButtonClick}>
        {value ? "Change Logo" : "Upload Logo"}
      </Button>

      {/* FileUpload hidden but functional */}
      <div className="absolute w-0 h-0 overflow-hidden opacity-0 pointer-events-none">
        <FileUpload
          ref={fileUploadRef}
          uploadId="company-logo"
          type="image"
          affiliate={affiliate}
          maxFiles={1}
          onUploadSuccess={(_, __, ___, url) => {
            onChange(url)
          }}
        />
      </div>
    </div>
  )
}
