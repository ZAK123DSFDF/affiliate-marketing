import InvalidToken from "@/components/pages/InvalidToken"
import VerifyClient from "@/components/pages/VerifyClient"

type Props = {
  searchParams: Promise<{ affiliateToken?: string }>
  params: Promise<{ orgId: string }>
}

export default async function VerifyLoginPage({ searchParams }: Props) {
  const { affiliateToken } = await searchParams

  if (!affiliateToken) {
    return (
      <InvalidToken
        affiliate={true}
        message="The login link is invalid or expired."
      />
    )
  }

  return <VerifyClient token={affiliateToken} mode="login" />
}
