"use server";
import { returnError } from "@/lib/errorHandler";
import { organization } from "@/db/schema";
import { db } from "@/db/drizzle";
import { companySchema } from "@/components/pages/Create-Company";
import { z } from "zod";
export const CreateOrganization = async (
  data: z.infer<typeof companySchema>,
) => {
  try {
    const [newOrg] = await db
      .insert(organization)
      .values({ ...data, commissionValue: data.commissionValue.toFixed(2) })
      .returning();

    if (!newOrg) {
      throw {
        status: 500,
        error: "Organization creation failed",
        toast: "Failed to create organization. Please try again.",
      };
    }

    return { ok: true, data: newOrg };
  } catch (err) {
    console.error("Organization create error", err);
    return returnError(err);
  }
};
