"use server";

import { cookies } from "next/headers";
import { returnError } from "@/lib/errorHandler";
import { organization, userToOrganization } from "@/db/schema";
import { db } from "@/db/drizzle";
import { companySchema } from "@/components/pages/Create-Company";
import { z } from "zod";
import jwt from "jsonwebtoken";

export const CreateOrganization = async (
  data: z.infer<typeof companySchema>,
) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      throw {
        status: 401,
        error: "Unauthorized",
        toast: "You must be logged in to create an organization.",
      };
    }

    const decoded = jwt.decode(token) as {
      id: string;
      email: string;
      role: string;
      type: string;
    };

    // Insert the new organization
    const [newOrg] = await db
      .insert(organization)
      .values({
        ...data,
        commissionValue: data.commissionValue.toFixed(2),
      })
      .returning();

    if (!newOrg) {
      throw {
        status: 500,
        error: "Organization creation failed",
        toast: "Failed to create organization. Please try again.",
      };
    }

    // Link user to organization
    await db.insert(userToOrganization).values({
      userId: decoded.id,
      organizationId: newOrg.id,
    });

    return { ok: true, data: newOrg };
  } catch (err) {
    console.error("Organization create error", err);
    return returnError(err);
  }
};
