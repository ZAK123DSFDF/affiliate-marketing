import { VerifyServer } from "@/lib/server/verifyServer"
import InvalidToken from "@/components/pages/InvalidToken"
import { getValidatedOrgFromParams } from "@/util/getValidatedOrgFromParams"

type Props = {
  searchParams: Promise<{ affiliateToken?: string }>
  params: Promise<{ orgId: string }>
}

export default async function VerifyLoginPage({ searchParams, params }: Props) {
  const { affiliateToken } = await searchParams
  const orgId = await getValidatedOrgFromParams({ params })
  if (affiliateToken) {
    await VerifyServer({ token: affiliateToken, tokenType: "affiliate" })
  } else {
    return (
      <InvalidToken
        affiliate={false}
        message="The login link is invalid or expired."
        orgId={orgId}
      />
    )
  }

  return null
}
