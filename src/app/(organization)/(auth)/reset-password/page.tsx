import React from "react"
import ResetPassword from "@/components/pages/Reset-password"
import InvalidToken from "@/components/pages/InvalidToken"
import { validateResetToken } from "@/lib/server/validateResetToken"
import { redirectIfAuthed } from "@/lib/server/authGuards"

type Props = {
  searchParams: Promise<{ organizationToken?: string }>
}

const ResetPasswordPage = async ({ searchParams }: Props) => {
  await redirectIfAuthed()
  const { organizationToken } = await searchParams

  if (!organizationToken) {
    return (
      <InvalidToken
        affiliate={false}
        message="The reset link is invalid or expired."
      />
    )
  }

  const sessionPayload = await validateResetToken({
    token: organizationToken,
    tokenType: "organization",
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
