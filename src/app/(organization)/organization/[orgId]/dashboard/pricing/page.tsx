import { getUserPlan } from "@/lib/server/getUserPlan"

export default async function PricingPage() {
  const plan = await getUserPlan()

  const getButtonText = () => {
    if (plan.plan === "FREE") return "Upgrade or Buy Bundle"
    if (plan.plan === "PRO") {
      if (plan.type === "PURCHASE") return "Purchase Ultimate Bundle"
      if (plan.type === "SUBSCRIPTION") return "Upgrade to Ultimate"
    }
    return "You're on Ultimate 🎉"
  }

  const getButtonDisabled = plan.plan === "ULTIMATE"

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Choose Your Plan</h1>

      <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl">
        {/* Free Plan */}
        <div className="border rounded-2xl p-6 text-center shadow-sm">
          <h2 className="text-2xl font-semibold mb-2">Free</h2>
          <p className="text-3xl font-bold mb-4">$0</p>
          <ul className="text-gray-600 mb-6 space-y-2">
            <li>✔️ Basic features</li>
            <li>✔️ 1 Organization</li>
          </ul>
          <button
            disabled={plan.plan === "FREE"}
            className={`px-4 py-2 rounded-lg font-medium ${
              plan.plan === "FREE"
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Current Plan
          </button>
        </div>

        {/* Pro Plan */}
        <div className="border rounded-2xl p-6 text-center shadow-sm">
          <h2 className="text-2xl font-semibold mb-2">Pro</h2>
          <p className="text-3xl font-bold mb-4">$19/month</p>
          <ul className="text-gray-600 mb-6 space-y-2">
            <li>✔️ Everything in Free</li>
            <li>✔️ Advanced analytics</li>
            <li>✔️ Up to 3 organizations</li>
          </ul>
          <button
            disabled={plan.plan === "PRO" || plan.plan === "ULTIMATE"}
            className={`px-4 py-2 rounded-lg font-medium ${
              plan.plan === "PRO" || plan.plan === "ULTIMATE"
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {plan.plan === "PRO" ? "Current Plan" : "Upgrade to Pro"}
          </button>
        </div>

        {/* Ultimate Plan */}
        <div className="border rounded-2xl p-6 text-center shadow-sm">
          <h2 className="text-2xl font-semibold mb-2">Ultimate</h2>
          <p className="text-3xl font-bold mb-4">$200 one-time</p>
          <ul className="text-gray-600 mb-6 space-y-2">
            <li>✔️ Everything in Pro</li>
            <li>✔️ Unlimited organizations</li>
            <li>✔️ Lifetime access</li>
          </ul>
          <button
            disabled={getButtonDisabled}
            className={`px-4 py-2 rounded-lg font-medium ${
              getButtonDisabled
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {getButtonText()}
          </button>
        </div>
      </div>
    </main>
  )
}
