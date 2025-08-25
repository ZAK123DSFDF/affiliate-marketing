"use server"
import { db } from "@/db/drizzle"
import { affiliate } from "@/db/schema"
import { eq } from "drizzle-orm"
import { decodedType } from "@/lib/types/decodedType"

export const updateAffiliateProfileAction = async (
  decoded: decodedType,
  { name, email }: { name: string; email: string }
) => {
  await db
    .update(affiliate)
    .set({ name, email })
    .where(eq(affiliate.id, decoded.id))
}
