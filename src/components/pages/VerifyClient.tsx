"use client"

import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { VerifyServer } from "@/lib/server/verifyServer"
import { useRouter } from "next/navigation"

export default function VerifyClient({ token }: { token: string }) {
  const router = useRouter()

  const { isPending, isError, data } = useQuery({
    queryKey: ["verify-login", token],
    queryFn: async () => {
      if (!token) throw new Error("No token provided")
      return await VerifyServer({
        token,
        tokenType: "seller",
        mode: "login",
      })
    },
    enabled: !!token,
    retry: false,
    refetchOnWindowFocus: false,
  })

  // ✅ Perform redirect AFTER render
  useEffect(() => {
    if (data?.redirectUrl) {
      router.push(data.redirectUrl)
    }
  }, [data?.redirectUrl, router])

  if (isPending) {
    return <p>Verifying your login...</p>
  }

  if (isError || data?.success === false) {
    return <p>The login link is invalid or expired.</p>
  }

  return null
}
