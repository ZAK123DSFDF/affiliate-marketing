"use client"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { AppDialog } from "@/components/ui-custom/AppDialog"

interface LinksDialogProps {
  links?: (string | null | undefined)[]
  title?: string
  description?: string
  affiliate?: boolean
}

export function LinksDialog({
  links = [],
  title = "Links",
  description = "All the referral links this affiliate has created.",
  affiliate = false,
}: LinksDialogProps) {
  const [open, setOpen] = useState(false)

  // Filter out null, undefined, or empty strings
  const filteredLinks = Array.isArray(links)
    ? links.filter((l) => l != null && l !== "")
    : []

  return (
    <>
      <Button
        variant="link"
        className="p-0 text-blue-600 underline"
        onClick={() => setOpen(true)}
      >
        View Links
      </Button>

      <AppDialog
        open={open}
        onOpenChange={setOpen}
        title={title}
        description={description}
        affiliate={affiliate}
        showFooter={false}
      >
        <ul className="space-y-2">
          {filteredLinks.length > 0 ? (
            filteredLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {link}
                </a>
              </li>
            ))
          ) : (
            <li className="text-muted-foreground">No links created.</li>
          )}
        </ul>
      </AppDialog>
    </>
  )
}
