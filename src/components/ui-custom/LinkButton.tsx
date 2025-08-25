"use client"

import Link from "next/link"

interface LinkButtonProps {
  isPreview: boolean
  label: string
  href?: string
  tabName?: string
  linkTextColor?: string
  className?: string
  setTab?: (tab: string) => void
}

export const LinkButton = ({
  isPreview,
  label,
  href,
  tabName,
  linkTextColor,
  className,
  setTab,
}: LinkButtonProps) => {
  if (isPreview && tabName) {
    return (
      <button
        type="button"
        onClick={() => setTab?.(tabName)}
        className={`text-sm font-medium hover:underline underline-offset-4 text-primary ${className || ""}`}
        style={{
          color: linkTextColor || undefined,
        }}
      >
        {label}
      </button>
    )
  }

  return (
    <Link
      href={href || "#"}
      className={`text-sm font-medium hover:underline underline-offset-4 text-primary ${className || ""}`}
      style={{
        color: linkTextColor || undefined,
      }}
    >
      {label}
    </Link>
  )
}
