"use server";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { affiliate } from "@/db/schema";
import { decodedType } from "@/lib/types/decodedType";

export const getAffiliateDataAction = async (decoded: decodedType) => {
  const affiliateData = await db.query.affiliate.findFirst({
    where: eq(affiliate.id, decoded.id),
    columns: {
      password: false,
    },
  });

  if (!affiliateData) {
    throw {
      status: 404,
      error: "User not found",
      toast: "Your account could not be found.",
    };
  }
  return affiliateData;
};
