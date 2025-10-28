// app/(organization)/verify-login/page.tsx
import InvalidToken from "@/components/pages/InvalidToken"
import VerifyClient from "@/components/pages/VerifyClient"

type Props = {
  searchParams: Promise<{ organizationToken?: string }>
}

export default async function VerifyLoginPage({ searchParams }: Props) {
  const { organizationToken } = await searchParams

  if (!organizationToken) {
    return (
      <InvalidToken
        affiliate={false}
        message="The login link is invalid or expired."
      />
    )
  }

  return (
    <VerifyClient
      affiliate={false}
      token={organizationToken}
      mode="changeEmail"
    />
  )
}
