// app/(organization)/verify-signup/page.tsx
import InvalidToken from "@/components/pages/InvalidToken"
import VerifyClient from "@/components/pages/VerifyClient"

type Props = {
  searchParams: Promise<{ teamToken?: string }>
}

export default async function VerifySignupPage({ searchParams }: Props) {
  const { teamToken } = await searchParams

  if (!teamToken) {
    return (
      <InvalidToken
        affiliate={false}
        message="The signup link is invalid or expired."
      />
    )
  }

  return <VerifyClient affiliate={false} token={teamToken} mode="signup" />
}
