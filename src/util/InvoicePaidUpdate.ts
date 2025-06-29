import { safeFormatAmount } from "@/util/SafeParse";
import { getCurrencyDecimals } from "@/util/CurrencyDecimal";
import { convertToUSD } from "@/util/CurrencyConvert";
import { db } from "@/db/drizzle";
import { checkTransaction } from "@/db/schema";
import { eq } from "drizzle-orm";

export const invoicePaidUpdate = async (
  total: string,
  currency: string,
  existingAmount: string,
  subscriptionId: string,
) => {
  const rawAmount = safeFormatAmount(total);
  const decimals = getCurrencyDecimals(currency ?? "usd");
  const { amount } = await convertToUSD(
    parseFloat(rawAmount),
    currency ?? "usd",
    decimals,
  );
  const newAmount = Math.max(
    0,
    parseFloat(existingAmount) + parseFloat(amount),
  ).toFixed(2);
  await db
    .update(checkTransaction)
    .set({
      amount: newAmount,
    })
    .where(eq(checkTransaction.subscriptionId, subscriptionId));
};
