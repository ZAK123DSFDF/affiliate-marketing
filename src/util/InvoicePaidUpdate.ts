// util/InvoicePaidUpdate.ts
import { safeFormatAmount } from "@/util/SafeParse";
import { getCurrencyDecimals } from "@/util/CurrencyDecimal";
import { convertToUSD } from "@/util/CurrencyConvert";
import { db } from "@/db/drizzle";
import { affiliatePayment } from "@/db/schema";
import { eq } from "drizzle-orm";

export const invoicePaidUpdate = async (
  total: string,
  currency: string,
  existingAmount: string,
  existingCommission: string,
  subscriptionId: string,
  affiliateLinkId: string,
  commissionType: string,
  commissionValue: string,
) => {
  const rawAmount = safeFormatAmount(total);
  const decimals = getCurrencyDecimals(currency ?? "usd");

  const { amount: invoiceAmount } = await convertToUSD(
    parseFloat(rawAmount),
    currency ?? "usd",
    decimals,
  );

  const newAmount = Math.max(
    0,
    parseFloat(existingAmount) + parseFloat(invoiceAmount),
  );

  let addedCommission = 0;

  if (commissionType === "percentage") {
    addedCommission =
       ( parseFloat(invoiceAmount) * parseFloat(commissionValue)) / 100
  } else if (commissionType === "fixed") {
    addedCommission =
      parseFloat(invoiceAmount) < 0
        ? 0
        : parseFloat(commissionValue);
  }

  const totalCommission = Math.max(
    0,
    parseFloat(existingCommission) + addedCommission,
  );

  await db
    .update(affiliatePayment)
    .set({
      amount: newAmount.toFixed(2),
      commission: totalCommission.toFixed(2),
    })
    .where(eq(affiliatePayment.subscriptionId, subscriptionId));
};
