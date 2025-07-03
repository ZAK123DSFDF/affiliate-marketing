// app/actions/auth/orgInfo.ts
"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { db } from "@/db/drizzle";
import { returnError } from "@/lib/errorHandler";
import { OrgInfoResponse } from "@/lib/types/organization";

export const orgInfo = async (orgId: string): Promise<OrgInfoResponse> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      throw {
        status: 401,
        error: "Unauthorized",
        toast: "You must be logged in.",
      };
    }

    const decoded = jwt.decode(token) as { id: string };
    if (!decoded?.id) {
      throw {
        status: 400,
        error: "Invalid token",
        toast: "Session invalid or expired.",
      };
    }

    const userId = decoded.id;
    const relation = await db.query.userToOrganization.findFirst({
      where: (uto, { and, eq }) =>
        and(eq(uto.userId, userId), eq(uto.organizationId, orgId)),
    });

    if (!relation) {
      throw {
        status: 403,
        error: "Access denied",
        toast: "You do not have access to this organization.",
      };
    }

    // Fetch organization details
    const org = await db.query.organization.findFirst({
      where: (org, { eq }) => eq(org.id, orgId),
    });

    if (!org) {
      throw {
        status: 404,
        error: "Organization not found",
        toast: "The requested organization does not exist.",
      };
    }

    return {
      ok: true,
      data: {
        id: org.id,
        name: org.name,
        domainName: org.domainName,
        logoUrl: org.logoUrl ?? "", // Already unioned with `string | null`
        referralParam: org.referralParam as "ref" | "via" | "aff",
        cookieLifetimeValue: org.cookieLifetimeValue ?? 30,
        cookieLifetimeUnit: org.cookieLifetimeUnit as
          | "day"
          | "week"
          | "month"
          | "year",
        commissionType: org.commissionType as "percentage" | "fixed",
        commissionValue: org.commissionValue ?? "0.00",
        commissionDurationValue: org.commissionDurationValue ?? 30,
        commissionDurationUnit: org.commissionDurationUnit as
          | "day"
          | "week"
          | "month"
          | "year",
        currency: (org.currency ?? "USD") as
          | "USD"
          | "EUR"
          | "GBP"
          | "CAD"
          | "AUD",
        createdAt: org.createdAt,
        updatedAt: org.updatedAt,
      },
    };
  } catch (err) {
    console.error("orgInfo error:", err);
    return returnError(err) as OrgInfoResponse;
  }
};
