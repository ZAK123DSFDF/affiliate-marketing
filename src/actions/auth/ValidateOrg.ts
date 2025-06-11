"use server";

import { db } from "@/db/drizzle";
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export async function validateOrg(orgId: string) {
  // First validate format
  if (!UUID_REGEX.test(orgId)) {
    return { orgFound: false };
  }
  const org = await db.query.organization.findFirst({
    where: (u, { eq }) => eq(u.id, orgId),
  });

  if (!org) {
    return { orgFound: false };
  }
  return { orgFound: true, org };
}
