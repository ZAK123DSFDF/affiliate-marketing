"use client"

import React, { useEffect } from "react"
import { bridgeConsoleToServer } from "@/util/ConsoleBridge"

export default function ClientBridgeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    bridgeConsoleToServer()
  }, [])

  return <>{children}</>
}
