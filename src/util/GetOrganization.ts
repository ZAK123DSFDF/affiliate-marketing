import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { db } from "@/db/drizzle";

export async function getOrganization() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) throw new Error("Unauthorized");

  const decoded = jwt.decode(token) as {
    id: string;
    organizationId: string;
  };

  // Step 1: Fetch org info
  const org = await db.query.organization.findFirst({
    where: (o, { eq }) => eq(o.id, decoded.organizationId),
  });
  if (!org) throw new Error("Organization not found");
  return { org, decoded };
}
