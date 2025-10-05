// app/(seller)/verify-signup/page.tsx
import InvalidToken from "@/components/pages/InvalidToken"
import VerifyClient from "@/components/pages/VerifyClient"

type Props = {
  searchParams: Promise<{ sellerToken?: string }>
}

export default async function VerifySignupPage({ searchParams }: Props) {
  const { sellerToken } = await searchParams

  if (!sellerToken) {
    return (
      <InvalidToken
        affiliate={false}
        message="The signup link is invalid or expired."
      />
    )
  }

  return <VerifyClient affiliate={false} token={sellerToken} mode="signup" />
}
