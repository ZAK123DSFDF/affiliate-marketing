"use server";
import * as bcrypt from "bcrypt";
import { db } from "@/db/drizzle";
import { affiliate } from "@/db/schema";
import { eq } from "drizzle-orm";
import { decodedType } from "@/lib/types/decodedType";

export const updateAffiliatePasswordAction = async (
  decoded: decodedType,
  newPassword: string,
) => {
  const hashed = await bcrypt.hash(newPassword, 10);
  await db
    .update(affiliate)
    .set({ password: hashed })
    .where(eq(affiliate.id, decoded.id));
};
