import { VerifyServer } from "@/lib/server/verifyServer"
import InvalidError from "@/components/pages/Error"

type Props = {
  searchParams: Promise<{ sellerToken?: string; affiliateToken?: string }>
}

export default async function VerifySignupPage({ searchParams }: Props) {
  const { sellerToken, affiliateToken } = await searchParams

  if (sellerToken) {
    await VerifyServer({ token: sellerToken, tokenType: "seller" })
  } else if (affiliateToken) {
    await VerifyServer({ token: affiliateToken, tokenType: "affiliate" })
  } else {
    return <InvalidError />
  }

  return null
}
