import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { FileUpload } from "@/components/ui-custom/FileUpload"
import { UploadProgressList } from "@/components/ui-custom/UploadProgressList"
import { useQueryClient } from "@tanstack/react-query"
import { useCustomToast } from "@/components/ui-custom/ShowCustomToast"
import { addFileAtom, removeFileAtom, uploadsAtom } from "@/store/UploadAtom"
import { useAtomValue, useSetAtom } from "jotai"
interface CsvUploadPopoverProps {
  orgId?: string
}
export default function CsvUploadPopover({ orgId }: CsvUploadPopoverProps) {
  const queryClient = useQueryClient()
  const uploads = useAtomValue(uploadsAtom)
  const removeFile = useSetAtom(removeFileAtom)
  const addFile = useSetAtom(addFileAtom)
  const { showCustomToast } = useCustomToast()
  const handleUploadSuccess = (
    file: File,
    fileId: string,
    uploadId: string
  ) => {
    if (!orgId) return

    showCustomToast({
      type: "success",
      title: "Upload successful",
      description: `"${file.name}" was uploaded successfully.`,
      affiliate: false,
    })

    setTimeout(() => removeFile(uploadId, fileId), 1500)

    queryClient
      .invalidateQueries({ queryKey: ["regular-payouts", orgId] })
      .then(() => console.log("Regular payouts invalidated"))

    queryClient
      .invalidateQueries({ queryKey: ["unpaid-payouts", orgId] })
      .then(() => console.log("Unpaid payouts invalidated"))
  }

  const handleUploadError = (file: File) => {
    showCustomToast({
      type: "error",
      title: "Upload failed",
      description: `"${file.name}" could not be uploaded. Please try again.`,
      affiliate: false,
    })
  }
  const handleRetry = async (uploadId: string, fileId: string) => {
    const upload = uploads[uploadId]
    if (!upload) return

    const failedFile = upload.files.find((f) => f.id === fileId)
    if (!failedFile) return

    removeFile(uploadId, fileId)

    try {
      const newId = await addFile(uploadId, failedFile.file)
      showCustomToast({
        type: "success",
        title: "Retry Successful",
        description: `${failedFile.file.name} uploaded on retry.`,
        affiliate: false,
      })
      setTimeout(() => removeFile(uploadId, newId.id), 1500)
    } catch {
      showCustomToast({
        type: "error",
        title: "Retry Failed",
        description: `${failedFile.file.name} could not be uploaded.`,
        affiliate: false,
      })
    }
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Upload className="w-4 h-4 mr-2" />
          Upload CSV
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4">
        <div className="space-y-4">
          <FileUpload
            uploadId="csvUpload"
            type="csv"
            endpoint="/api/upload/csv"
            path="csvUpload"
            maxFiles={100}
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
          />
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1 pb-2">
            <UploadProgressList
              uploadId="csvUpload"
              files={uploads["csvUpload"]?.files ?? []}
              errorMessage={uploads["csvUpload"]?.errorMessage ?? null}
              onRetry={handleRetry}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
