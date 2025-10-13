// app/(seller)/verify-login/page.tsx
import InvalidToken from "@/components/pages/InvalidToken"
import VerifyClient from "@/components/pages/VerifyClient"

type Props = {
  searchParams: Promise<{ sellerToken?: string }>
}

export default async function VerifyLoginPage({ searchParams }: Props) {
  const { sellerToken } = await searchParams

  if (!sellerToken) {
    return (
      <InvalidToken
        affiliate={false}
        message="The login link is invalid or expired."
      />
    )
  }

  return (
    <VerifyClient affiliate={false} token={sellerToken} mode="changeEmail" />
  )
}
