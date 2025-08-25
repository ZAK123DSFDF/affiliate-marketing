"use client"

import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ErrorCardProps {
  message: string
  className?: string
}

export function ErrorCard({ message, className }: ErrorCardProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border border-red-300 bg-red-50 p-4 text-red-700",
        className
      )}
    >
      <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
      <p className="text-sm">{message}</p>
    </div>
  )
}
