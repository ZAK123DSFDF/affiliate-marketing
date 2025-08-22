import PayPalConnect from "@/components/ui-custom/PayPalConnect"

export default function Payouts() {
  return (
    <main className="w-full p-6">
      <h1 className="text-2xl font-bold mb-8">PayPal Payout System</h1>
      <PayPalConnect />
    </main>
  )
}
