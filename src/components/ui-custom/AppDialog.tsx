// components/ui/AppDialog.tsx
"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface AppDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  children?: React.ReactNode // 👈 accepts any JSX element
  footer?: React.ReactNode // 👈 optional footer override
  confirmText?: string
  onConfirm?: () => void
  affiliate: boolean
  showFooter?: boolean
  hideCloseIcon?: boolean
}

export function AppDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  confirmText = "OK",
  onConfirm,
  affiliate = false,
  showFooter = true,
  hideCloseIcon = false,
}: AppDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        affiliate={affiliate}
        hideCloseIcon={hideCloseIcon}
        className="max-w-2xl"
      >
        {title || description ? (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        ) : (
          // 👇 Provide a hidden title for accessibility

          <DialogTitle className="sr-only">Dialog</DialogTitle>
        )}

        {/* 👇 Render injected component */}
        <div className="py-4">{children}</div>

        {showFooter && (
          <DialogFooter>
            {footer ?? (
              <Button
                onClick={() => {
                  onConfirm?.()
                  onOpenChange(false)
                }}
              >
                {confirmText}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
