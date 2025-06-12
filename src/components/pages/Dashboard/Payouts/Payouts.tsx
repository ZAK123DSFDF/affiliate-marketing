import PayPalConnect from "@/components/ui-custom/PayPalConnect";
import { Checkbox } from "@/components/ui/checkbox";

export default function Payouts() {
  return (
    <main className="w-full p-6">
      <h1 className="text-2xl font-bold mb-8">PayPal Payout System</h1>
      <PayPalConnect />
    </main>
  );
}
