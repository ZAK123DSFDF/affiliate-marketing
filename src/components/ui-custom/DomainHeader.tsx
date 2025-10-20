// components/ui-custom/DomainHeader.tsx
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

  return (
    <div
      className={cn(
        "flex items-center justify-center border border-border rounded-md bg-muted/50 text-sm py-1.5 px-3 text-muted-foreground select-none",
        className
      )}
    >
      <span className="text-foreground font-medium">
        https://{domain}
        {route.startsWith("/") ? route : `/${route}`}
      </span>
    </div>
  )
}
