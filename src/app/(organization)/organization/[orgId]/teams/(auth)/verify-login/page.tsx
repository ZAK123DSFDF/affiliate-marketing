// app/(organization)/verify-login/page.tsx
import InvalidToken from "@/components/pages/InvalidToken"
import VerifyClient from "@/components/pages/VerifyClient"

type Props = {
  searchParams: Promise<{ teamToken?: string }>
}

export default async function VerifyLoginPage({ searchParams }: Props) {
  const { teamToken } = await searchParams

  if (!teamToken) {
    return (
      <InvalidToken
        affiliate={false}
        message="The login link is invalid or expired."
      />
    )
  }

  return <VerifyClient affiliate={false} token={teamToken} mode="login" />
}
