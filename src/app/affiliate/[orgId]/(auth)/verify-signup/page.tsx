import InvalidToken from "@/components/pages/InvalidToken"
import VerifyClient from "@/components/pages/VerifyClient"

type Props = {
  searchParams: Promise<{ affiliateToken?: string }>
  params: Promise<{ orgId: string }>
}

export default async function VerifySignupPage({ searchParams }: Props) {
  const { affiliateToken } = await searchParams

  if (!affiliateToken) {
    return (
      <InvalidToken
        affiliate={true}
        message="The signup link is invalid or expired."
      />
    )
  }

  return <VerifyClient token={affiliateToken} mode="signup" />
}
