"use server";
import { db } from "@/db/drizzle";
import { eq, and } from "drizzle-orm";
import { affiliate, affiliatePayoutMethod } from "@/db/schema";
import { decodedType } from "@/lib/types/decodedType";

export const getAffiliateDataAction = async (decoded: decodedType) => {
  const affiliateData = await db.query.affiliate.findFirst({
    where: eq(affiliate.id, decoded.id),
    columns: {
      password: false, // exclude sensitive
    },
  });

  if (!affiliateData) {
    throw {
      status: 404,
      error: "User not found",
      toast: "Your account could not be found.",
    };
  }

  // Fetch PayPal payout method (if any)
  const paypalMethod = await db.query.affiliatePayoutMethod.findFirst({
    where: and(
      eq(affiliatePayoutMethod.affiliateId, decoded.id),
      eq(affiliatePayoutMethod.provider, "paypal"),
    ),
  });

  return {
    ...affiliateData,
    paypalEmail: paypalMethod?.accountIdentifier ?? null,
  };
};
