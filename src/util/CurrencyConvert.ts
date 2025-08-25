import { and, eq } from "drizzle-orm"
import { db } from "@/db/drizzle"
import { exchangeRate } from "@/db/schema"
export async function convertToUSD(
  amountSmallestUnit: number,
  currencyCode: string,
  decimals: number = 2
): Promise<{ amount: string; currency: string }> {
  const currency = currencyCode.toUpperCase()

  const [rateRow] = await db
    .select()
    .from(exchangeRate)
    .where(
      and(
        eq(exchangeRate.baseCurrency, "USD"),
        eq(exchangeRate.targetCurrency, currency)
      )
    )

  if (!rateRow) {
    throw new Error(`Exchange rate for ${currency} not found.`)
  }

  const rate = parseFloat(rateRow.rate)
  const amount = amountSmallestUnit / 10 ** decimals
  const usdAmount = amount / rate

  return {
    amount: String(parseFloat(usdAmount.toFixed(2))),
    currency: "USD",
  }
}
