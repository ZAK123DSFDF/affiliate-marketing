// components/providers/OrganizationProvider.tsx
"use client"
import React, { createContext, useContext } from "react"
import { Organization } from "@/lib/types/orgAuth"

interface OrganizationContextType {
  org?: Organization
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined
)

export function OrganizationProvider({
  org,
  children,
}: {
  org?: Organization
  children: React.ReactNode
}) {
  return (
    <OrganizationContext.Provider value={{ org }}>
      {children}
    </OrganizationContext.Provider>
  )
}

export function useOrganization() {
  const context = useContext(OrganizationContext)
  if (context === undefined) {
    throw new Error(
      "useOrganization must be used within an OrganizationProvider"
    )
  }
  return context
}
