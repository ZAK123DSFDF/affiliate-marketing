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
const emailSchema = z.object({
  newEmail: z.string().email("Invalid email address"),
})

type EmailFormValues = z.infer<typeof emailSchema>

export default function ProfileEmailDialog({
  open,
  onClose,
  onSubmit,
  affiliate,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (values: EmailFormValues) => void
  affiliate: boolean
}) {
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { newEmail: "" },
  })

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
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
