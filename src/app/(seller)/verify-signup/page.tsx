import { VerifyServer } from "@/lib/server/verifyServer"
import InvalidToken from "@/components/pages/InvalidToken"

type Props = {
  searchParams: Promise<{ sellerToken?: string }>
}

export default async function VerifySignupPage({ searchParams }: Props) {
  const { sellerToken } = await searchParams

  if (sellerToken) {
    await VerifyServer({
      token: sellerToken,
      tokenType: "seller",
      mode: "signup",
    })
  } else {
    return (
      <InvalidToken
        affiliate={false}
        message="The signup link is invalid or expired."
      />
    )
  }

  return null
}
