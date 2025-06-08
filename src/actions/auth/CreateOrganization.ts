import { organization } from "@/db/schema";
import { cookies } from "next/headers";
import { db } from "@/db/drizzle";
import { returnError } from "@/lib/errorHandler";
import jwt from "jsonwebtoken";
import { verifyToken } from "@/util/VerifyToken";
export const CreateOrganization = async ({ name, slug, domainName }: any) => {
  try {
    await verifyToken();
    // Insert new organization
    const [newOrg] = await db
      .insert(organization)
      .values({ name, slug, domainName })
      .returning();

    // Ensure an organization was actually created and returned
    if (!newOrg) {
      throw {
        status: 500,
        error: "Failed to create organization.",
        toast:
          "Something went wrong during organization creation. Please try again.",
      };
    }

    return { ok: true, data: newOrg };
  } catch (error: any) {
    console.error("company creation error", error); // Log the full error for debugging
    return returnError(error);
  }
};
