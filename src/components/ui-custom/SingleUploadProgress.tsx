"use client"

import { Progress } from "@/components/ui/progress"
import { Loader2, Check, X } from "lucide-react"
import type { UploadFile } from "./UploadProgressList"

interface SingleUploadProgressProps {
  file: UploadFile
  errorMessage?: string | null
}

export function SingleUploadProgress({
  file,
  errorMessage,
}: SingleUploadProgressProps) {
  return (
    <div className="space-y-3">
      {errorMessage && (
        <p className="text-sm text-red-600 font-medium">{errorMessage}</p>
      )}

      <div className="p-2 rounded-md border space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium truncate max-w-[70%]">
            {file.name}
          </p>
          <div className="flex items-center gap-2">
            {file.status === "pending" && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
            {file.status === "processing" && (
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            )}
            {file.status === "success" && (
              <div className="h-5 w-5 rounded-full bg-green-600 flex items-center justify-center">
                <Check className="h-3 w-3 text-white" />
              </div>
            )}
            {file.status === "error" && (
              <div className="h-5 w-5 rounded-full bg-red-600 flex items-center justify-center">
                <X className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
        </div>

        <Progress
          value={file.progress}
          className={`h-2 transition-colors ${
            file.status === "success"
              ? "bg-green-200 [&>div]:bg-green-600"
              : file.status === "error"
                ? "bg-red-200 [&>div]:bg-red-600"
                : file.status === "processing"
                  ? "bg-blue-200 [&>div]:bg-blue-600"
                  : ""
          }`}
        />

        <p className="text-xs">
          {file.status === "pending" && (
            <span className="text-muted-foreground">
              Uploading… {file.progress}%
            </span>
          )}
          {file.status === "processing" && (
            <span className="text-blue-600">Processing…</span>
          )}
          {file.status === "success" && (
            <span className="text-green-600">Completed</span>
          )}
          {file.status === "error" && (
            <span className="text-red-600">Failed</span>
          )}
        </p>
      </div>
    </div>
  )
}
