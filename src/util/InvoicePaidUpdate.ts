// util/InvoicePaidUpdate.ts
import { safeFormatAmount } from "@/util/SafeParse";
import { getCurrencyDecimals } from "@/util/CurrencyDecimal";
import { convertToUSD } from "@/util/CurrencyConvert";
import { affiliateInvoice } from "@/db/schema";
import { db } from "@/db/drizzle";

export const invoicePaidUpdate = async (
  total: string,
  currency: string,
  customerId: string,
  subscriptionId: string,
  affiliateLinkId: string,
  commissionType: string,
  commissionValue: string,
) => {
  const rawAmount = safeFormatAmount(total);
  const decimals = getCurrencyDecimals(currency ?? "usd");

  const { amount: invoiceAmount, currency: convertedCurrency } =
    await convertToUSD(parseFloat(rawAmount), currency ?? "usd", decimals);
  let addedCommission = 0;
  if (commissionType === "percentage") {
    addedCommission =
      (parseFloat(invoiceAmount) * parseFloat(commissionValue)) / 100;
  } else if (commissionType === "fixed") {
    addedCommission =
      parseFloat(invoiceAmount) < 0 ? 0 : parseFloat(commissionValue);
  }
  await db.insert(affiliateInvoice).values({
    paymentProvider: "stripe",
    subscriptionId,
    customerId,
    amount: invoiceAmount.toString(),
    currency: convertedCurrency,
    commission: addedCommission.toString(),
    paidAmount: "0.00",
    unpaidAmount: addedCommission.toFixed(2),
    affiliateLinkId,
  });
};
