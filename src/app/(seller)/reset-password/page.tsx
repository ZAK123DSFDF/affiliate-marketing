import React from "react"
import ResetPassword from "@/components/pages/Reset-password"
import InvalidToken from "@/components/pages/InvalidToken"
import { validateResetToken } from "@/lib/server/validateResetToken"
import jwt from "jsonwebtoken"

type Props = {
  searchParams: Promise<{ sellerToken?: string }>
}

const ResetPasswordPage = async ({ searchParams }: Props) => {
  const { sellerToken } = await searchParams

  if (!sellerToken) {
    return (
      <InvalidToken
        affiliate={false}
        message="The reset link is invalid or expired."
      />
    )
  }

  const sessionPayload = await validateResetToken({
    token: sellerToken,
    tokenType: "seller",
  })

  if (!sessionPayload) {
    return (
      <InvalidToken
        affiliate={false}
        message="The reset link is invalid or expired."
      />
    )
  }

  return (
    <ResetPassword
      affiliate={false}
      userId={sessionPayload.id}
      orgId={sessionPayload.orgId}
    />
  )
}

export default ResetPasswordPage
