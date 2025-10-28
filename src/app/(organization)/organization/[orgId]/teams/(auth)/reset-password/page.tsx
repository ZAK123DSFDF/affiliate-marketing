import React from "react"
import ResetPassword from "@/components/pages/Reset-password"
import InvalidToken from "@/components/pages/InvalidToken"
import { validateResetToken } from "@/lib/server/validateResetToken"
import { redirectIfAuthed, redirectTeamIfAuthed } from "@/lib/server/authGuards"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"

type Props = {
  searchParams: Promise<{ teamToken?: string }>
  params: Promise<{ orgId: string }>
}

const ResetPasswordPage = async ({ searchParams, params }: Props) => {
  const orgId = await getValidatedOrgFromParams({ params })
  await redirectTeamIfAuthed(orgId)
  const { teamToken } = await searchParams

  if (!teamToken) {
    return (
      <InvalidToken
        affiliate={false}
        message="The reset link is invalid or expired."
      />
    )
  }

  const sessionPayload = await validateResetToken({
    token: teamToken,
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
