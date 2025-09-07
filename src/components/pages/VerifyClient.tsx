"use client"

import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { VerifyServer } from "@/lib/server/verifyServer"
import { useRouter } from "next/navigation"

export default function VerifyClient({
  token,
  mode,
}: {
  token: string
  mode: "login" | "signup"
}) {
  const router = useRouter()

  const { isPending, isError, data } = useQuery({
    queryKey: ["verify", token, mode],
    queryFn: async () => {
      if (!token) throw new Error("No token provided")
      return await VerifyServer({
        token,
        mode,
      })
    },
    enabled: !!token,
    retry: false,
    refetchOnWindowFocus: false,
  })

  // Redirect if VerifyServer gives redirectUrl
  useEffect(() => {
    if (data?.redirectUrl) {
      router.push(data.redirectUrl)
    }
  }, [data?.redirectUrl, router])

  if (isPending) {
    return <p>Verifying your {mode}...</p>
  }

  if (isError || data?.success === false) {
    return <p>The {mode} link is invalid or expired.</p>
  }

  return null
}
