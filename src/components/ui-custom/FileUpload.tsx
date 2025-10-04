"use client"
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone"
import { useSetAtom } from "jotai"
import { addFileAtom, setErrorMessageAtom } from "@/store/UploadAtom"
import { useState } from "react"
import { useCustomToast } from "@/components/ui-custom/ShowCustomToast"
import { validateAndUploadFile } from "@/util/FileUpload"

export interface FileUploadProps {
  uploadId: string
  type: "csv" | "image"
  endpoint?: string
  maxFiles?: number
  maxSizeMB?: number
  path?: string
  affiliate: boolean
  preview?: boolean
  onUploadSuccess?: (
    file: File,
    fileId: string,
    uploadId: string,
    url: string
  ) => void
  onUploadError?: (file: File, err: any, uploadId: string) => void
}

export function FileUpload({
  uploadId,
  type,
  endpoint,
  maxFiles = 100,
  maxSizeMB = 5,
  path,
  preview = false,
  affiliate = false,
  onUploadSuccess,
  onUploadError,
}: FileUploadProps) {
  // Jotai mutations
  const addFile = useSetAtom(addFileAtom)
  const setErrorMessage = useSetAtom(setErrorMessageAtom)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const MAX_SIZE = maxSizeMB * 1024 * 1024
  const { showCustomToast } = useCustomToast()
  const triggerError = (msg: string) => {
    setErrorMessage(uploadId, msg)
    showCustomToast({
      type: "error",
      title: "Upload Failed",
      description: msg,
      affiliate,
    })
  }
  const handleError = (err: unknown) => {
    console.log(`[${uploadId}] dropzone error:`, err)

    if (err instanceof Error) {
      const msg = err.message.toLowerCase()

      if (msg.includes("too many files") || msg.includes("maxfiles")) {
        return triggerError(`You can only upload up to ${maxFiles} files.`)
      }

      if (msg.includes("file too large") || msg.includes("size")) {
        return triggerError(`Each file must be under ${maxSizeMB}MB.`)
      }

      if (msg.includes("invalid") || msg.includes("type")) {
        return triggerError(
          type === "csv"
            ? "Invalid file type. Please upload CSV files."
            : "Invalid file type. Please upload image files."
        )
      }
    }

    // fallback for anything unexpected
    triggerError("Something went wrong. Please try again.")
  }

  const handleSuccess = (
    file: File,
    fileId: string,
    uploadId: string,
    url: string
  ) => {
    if (preview && type === "image") {
      setPreviewUrl(URL.createObjectURL(file))
    }
    onUploadSuccess?.(file, fileId, uploadId, url)
  }

  const handleFailure = (file: File, err: any, uploadId: string) => {
    if (onUploadError) {
      onUploadError(file, err, uploadId)
    } else {
      console.error(err)
    }
  }

  const handleDrop = (accepted: File[]) => {
    setErrorMessage(uploadId, null)
    if (accepted.length === 0) return

    accepted.forEach((file) => {
      validateAndUploadFile({
        file,
        type,
        maxSizeMB,
        uploadId,
        path,
        endpoint,
        addFile,
        triggerError,
        handleSuccess,
        handleFailure,
      }).then(() => console.log("File processed"))
    })
  }

  return (
    <div className="space-y-2">
      <Dropzone
        accept={
          type === "csv"
            ? {
                "text/csv": [".csv"],
                "application/vnd.ms-excel": [".csv"],
                "application/octet-stream": [".csv"],
              }
            : { "image/*": [] }
        }
        maxFiles={maxFiles}
        maxSize={MAX_SIZE}
        onDrop={handleDrop}
        onError={handleError}
      >
        <DropzoneEmptyState />
        <DropzoneContent />
      </Dropzone>
      {preview && previewUrl && (
        <div className="mt-2">
          <img
            src={previewUrl}
            alt="Preview"
            className="h-16 w-16 rounded border object-cover"
          />
        </div>
      )}
    </div>
  )
}
