"use client"

import React from "react"
import { cn } from "@/lib/utils"

export function DomainHeader({
  domain,
  route,
  className,
}: {
  domain?: string
  route: string
  className?: string
}) {
  if (!domain) return null
  const noSlashRoutes = ["/", "/splash-loading", "/splash-error"]
  const normalized = route.startsWith("/") ? route : `/${route}`
  const mapped =
    normalized === "/dashboard" ? "/dashboard/analytics" : normalized
  const cleanRoute = noSlashRoutes.includes(mapped) ? "" : mapped

  const fullUrl = `https://${domain}${cleanRoute}`

  const handleOpen = () => {
    window.open(fullUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <div
      onClick={handleOpen}
      title="Click to open preview in new tab"
      className={cn(
        "flex items-center justify-center border border-border rounded-md bg-muted/50 text-sm py-1.5 px-3 text-muted-foreground cursor-pointer hover:bg-muted transition-colors select-none",
        className
      )}
    >
      <span className="text-foreground font-medium">{fullUrl}</span>
    </div>
  )
}
