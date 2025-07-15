// util/InvoicePaidUpdate.ts
import { safeFormatAmount } from "@/util/SafeParse";
import { getCurrencyDecimals } from "@/util/CurrencyDecimal";
import { convertToUSD } from "@/util/CurrencyConvert";
import { affiliateInvoice } from "@/db/schema";
import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { PgTransaction } from "drizzle-orm/pg-core";
type DBorTx =
  | NeonHttpDatabase<typeof import("@/db/schema")>
  | PgTransaction<any, any, any>;
export const invoicePaidUpdate = async (
  tx: DBorTx,
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

  const { amount: invoiceAmount } = await convertToUSD(
    parseFloat(rawAmount),
    currency ?? "usd",
    decimals,
  );
  let addedCommission = 0;
  if (commissionType === "percentage") {
    addedCommission =
      (parseFloat(invoiceAmount) * parseFloat(commissionValue)) / 100;
  } else if (commissionType === "fixed") {
    addedCommission =
      parseFloat(invoiceAmount) < 0 ? 0 : parseFloat(commissionValue);
  }
  await tx.insert(affiliateInvoice).values({
    paymentProvider: "stripe",
    subscriptionId,
    customerId,
    amount: invoiceAmount.toString(),
    currency,
    commission: addedCommission.toString(),
    paidAmount: "0.00",
    unpaidAmount: addedCommission.toFixed(2),
    affiliateLinkId,
  });
};
