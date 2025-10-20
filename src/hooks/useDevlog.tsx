"use client"

import { useEffect } from "react"

export function useDevLog(name: string) {
  if (process.env.NODE_ENV !== "development") return

  useEffect(() => {
    const id = setTimeout(() => {
      console.log(`${name} mounted`)
    }, 50)

    return () => {
      clearTimeout(id)
      console.log(`${name} unmounted`)
    }
  }, [name])
}
