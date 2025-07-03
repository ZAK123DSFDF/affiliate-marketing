"use server";

import { db } from "@/db/drizzle";

export async function validateOrg(orgId: string) {
  const org = await db.query.organization.findFirst({
    where: (u, { eq }) => eq(u.id, orgId),
  });

  if (!org) {
    return { orgFound: false };
  }
  return { orgFound: true, org };
}
