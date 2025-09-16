"use server"
import { db } from "@/db/drizzle"
import { organization } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function getUserOrgs(userId: string) {
  return db.select().from(organization).where(eq(organization.userId, userId))
}
