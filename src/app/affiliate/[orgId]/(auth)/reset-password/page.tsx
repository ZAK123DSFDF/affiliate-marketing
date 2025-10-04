import React from "react"
import ResetPassword from "@/components/pages/Reset-password"
import InvalidToken from "@/components/pages/InvalidToken"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"
import { validateResetToken } from "@/lib/server/validateResetToken"
import { redirectIfAffiliateAuthed } from "@/lib/server/authGuards"
import { getOrg } from "@/lib/server/getOrg"

type Props = {
  searchParams: Promise<{ affiliateToken?: string }>
  params: Promise<{ orgId: string }>
}

const ResetPasswordPage = async ({ searchParams, params }: Props) => {
  const { affiliateToken } = await searchParams
  const orgId = await getValidatedOrgFromParams({ params })
  await redirectIfAffiliateAuthed(orgId)
  const org = await getOrg(orgId)
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

  return (
    <ResetPassword
      orgId={orgId}
      affiliate
      userId={sessionPayload.id}
      org={org}
    />
  )
}

export default ResetPasswordPage
