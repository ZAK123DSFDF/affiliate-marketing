import PayPalConnect from "@/components/ui-custom/PayPalConnect";
import { Checkbox } from "@/components/ui/checkbox";

export default function Payouts() {
  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">PayPal Payout System</h1>
      <PayPalConnect />
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Accept terms and conditions
        </label>
      </div>
    </main>
  );
}
