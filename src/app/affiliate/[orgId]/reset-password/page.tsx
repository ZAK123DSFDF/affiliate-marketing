import React from "react"
import ResetPassword from "@/components/pages/Reset-password"
import InvalidToken from "@/components/pages/InvalidToken"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { validateResetToken } from "@/lib/server/validateResetToken"
import { redirectIfAffiliateAuthed } from "@/lib/server/authGuards"

type Props = {
  searchParams: Promise<{ affiliateToken?: string }>
  params: Promise<{ orgId: string }>
}

const ResetPasswordPage = async ({ searchParams, params }: Props) => {
  const { affiliateToken } = await searchParams
  const orgId = await getValidatedOrgFromParams({ params })
  await redirectIfAffiliateAuthed()
  if (!affiliateToken) {
    return (
      <InvalidToken
        affiliate
        message="The reset link is invalid or expired."
        orgId={orgId}
      />
    )
  }

  const sessionPayload = await validateResetToken({
    token: affiliateToken,
    tokenType: "affiliate",
  })

  if (!sessionPayload) {
    return (
      <InvalidToken
        affiliate
        message="The reset link is invalid or expired."
        orgId={orgId}
      />
    )
  }

  return <ResetPassword orgId={orgId} affiliate userId={sessionPayload.id} />
}

export default ResetPasswordPage
