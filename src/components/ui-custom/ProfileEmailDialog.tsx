"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { InputField } from "@/components/Auth/FormFields"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import { ArrowRight, Loader2 } from "lucide-react"
import React from "react"
import { useAtomValue } from "jotai"
import { buttonCustomizationAtom } from "@/store/AuthCustomizationAtom"
const emailSchema = z.object({
  newEmail: z.string().email("Invalid email address"),
})

type EmailFormValues = z.infer<typeof emailSchema>

export default function ProfileEmailDialog({
  open,
  onClose,
  onSubmit,
  affiliate,
  loading,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (values: EmailFormValues) => void
  affiliate: boolean
  loading: boolean
}) {
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { newEmail: "" },
  })
  const {
    buttonDisabledTextColor,
    buttonBackgroundColor,
    buttonDisabledBackgroundColor,
    buttonTextColor,
  } = useAtomValue(buttonCustomizationAtom)
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent affiliate={affiliate}>
        <DialogHeader>
          <DialogTitle>Change Email</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <InputField
              control={form.control}
              name="newEmail"
              label="New Email Address"
              placeholder="new@example.com"
              type="email"
              profile
              affiliate={affiliate}
            />

            <DialogFooter>
              <Button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: loading
                    ? (affiliate && buttonDisabledBackgroundColor) || undefined
                    : (affiliate && buttonBackgroundColor) || undefined,
                  color: loading
                    ? (affiliate && buttonDisabledTextColor) || undefined
                    : (affiliate && buttonTextColor) || undefined,
                }}
              >
                {loading ? (
                  <>
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      style={{
                        color:
                          (affiliate && buttonDisabledTextColor) || undefined,
                      }}
                    />
                    submitting...
                  </>
                ) : (
                  <>changeEmail</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
