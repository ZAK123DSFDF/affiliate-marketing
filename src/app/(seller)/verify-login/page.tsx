import { VerifyServer } from "@/lib/server/verifyServer"
import InvalidToken from "@/components/pages/InvalidToken"

type Props = {
  searchParams: Promise<{ sellerToken?: string; affiliateToken?: string }>
}

export default async function VerifyLoginPage({ searchParams }: Props) {
  const { sellerToken, affiliateToken } = await searchParams

  if (sellerToken) {
    await VerifyServer({ token: sellerToken, tokenType: "seller" })
  } else if (affiliateToken) {
    await VerifyServer({ token: affiliateToken, tokenType: "affiliate" })
  } else {
    return (
      <InvalidToken
        affiliate={false}
        message="The login link is invalid or expired."
      />
    )
  }

  return null
}
