"use client"
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone"
import { useUploadStore } from "@/store/useUploadStore"

export interface FileUploadProps {
  uploadId: string // ✅ namespace key
  type: "csv" | "image"
  maxFiles?: number
  maxSizeMB?: number
  path?: string
}

export function FileUpload({
  uploadId,
  type,
  maxFiles = 100,
  maxSizeMB = 5,
  path,
}: FileUploadProps) {
  const { addFile, setErrorMessage } = useUploadStore()
  const MAX_SIZE = maxSizeMB * 1024 * 1024

  const handleError = (err: any) => {
    console.log(`[${uploadId}] dropzone error:`, err)
    const fallbackMsg = "Something went wrong. Please try again."

    if (Array.isArray(err)) {
      for (const rejection of err) {
        for (const e of rejection.errors || []) {
          const code = String(e.code || "").toLowerCase()
          if (code.includes("too-many")) {
            setErrorMessage(
              uploadId,
              `You can only upload up to ${maxFiles} files.`
            )
            return
          }
          if (code.includes("large") || code.includes("size")) {
            setErrorMessage(uploadId, `Each file must be under ${maxSizeMB}MB.`)
            return
          }
          if (code.includes("type")) {
            setErrorMessage(
              uploadId,
              type === "csv"
                ? "Invalid file type. Please upload CSV files."
                : "Invalid file type. Please upload image files."
            )
            return
          }
        }
      }
    }
    setErrorMessage(uploadId, fallbackMsg)
  }

  const handleDrop = (accepted: File[]) => {
    setErrorMessage(uploadId, null)
    if (accepted.length === 0) return

    accepted.forEach((file) => {
      if (file.size > MAX_SIZE) {
        setErrorMessage(
          uploadId,
          `"${file.name}" is too large (max ${maxSizeMB}MB).`
        )
        return
      }
      if (type === "csv" && !file.name.toLowerCase().endsWith(".csv")) {
        setErrorMessage(uploadId, `"${file.name}" is not a CSV file.`)
        return
      }
      if (type === "image" && !file.type.startsWith("image/")) {
        setErrorMessage(uploadId, `"${file.name}" is not an image file.`)
        return
      }

      addFile(uploadId, file, path)
    })
  }

  return (
    <Dropzone
      accept={type === "csv" ? { "text/csv": [] } : { "image/*": [] }}
      maxFiles={maxFiles}
      maxSize={MAX_SIZE}
      onDrop={handleDrop}
      onError={handleError}
    >
      <DropzoneEmptyState />
      <DropzoneContent />
    </Dropzone>
  )
}
