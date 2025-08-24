"use server";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { affiliate } from "@/db/schema";
import * as bcrypt from "bcrypt";
import { decodedType } from "@/lib/types/decodedType";

export const validateAffiliatePasswordAction = async (
  decoded: decodedType,
  currentPassword: string,
) => {
  const record = await db.query.affiliate.findFirst({
    where: eq(affiliate.id, decoded.id),
  });
  if (!record) throw { status: 404, toast: "User not found" };

  const isMatch = await bcrypt.compare(currentPassword, record.password);
  if (!isMatch) throw { status: 403, toast: "Incorrect current password" };
};
