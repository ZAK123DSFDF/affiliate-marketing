import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { FileUpload } from "@/components/ui-custom/FileUpload"
import { UploadProgressList } from "@/components/ui-custom/UploadProgressList"

export default function CsvUploadPopover() {
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
          <FileUpload uploadId="csvUpload" type="csv" maxFiles={100} />
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1 pb-2">
            <UploadProgressList uploadId="csvUpload" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
