import React from "react"

type Props = {
  searchParams: Promise<{
    _ptxn?: string
    transaction_id?: string
  }>
}

const ThankYouPage = async ({ searchParams }: Props) => {
  const params = await searchParams
  const txn = params._ptxn || params.transaction_id

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-3xl font-bold">Thank you! 🎉</h1>

      {txn ? (
        <p className="text-lg text-muted-foreground">
          Your transaction ID: <strong>{txn}</strong>
        </p>
      ) : (
        <p className="text-lg text-muted-foreground">
          Your payment is being processed...
        </p>
      )}

      <a
        href="/dashboard"
        className="px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        Go to dashboard
      </a>
    </div>
  )
}

export default ThankYouPage
