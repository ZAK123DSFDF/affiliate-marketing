// app/actions/auth/getUser.ts
"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { db } from "@/db/drizzle";
import { affiliate, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { returnError } from "@/lib/errorHandler";
import * as bcrypt from "bcrypt";
import { ResponseData } from "@/lib/types/response";
import { SafeAffiliateData } from "@/lib/types/authAffiliate";
import { revalidatePath } from "next/cache";

export const getAffiliateData = async (): Promise<
  ResponseData<SafeAffiliateData>
> => {
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

    const affiliateData = await db.query.affiliate.findFirst({
      where: eq(affiliate.id, decoded.id),
      columns: {
        password: false, // Explicitly exclude password
      },
    });

    if (!affiliateData) {
      throw {
        status: 404,
        error: "User not found",
        toast: "Your account could not be found.",
      };
    }

    return { ok: true, data: affiliateData };
  } catch (err) {
    console.error("getUserData error:", err);
    return returnError(err) as ResponseData<SafeAffiliateData>;
  }
};

export async function updateAffiliateProfile(
  orgId: string,
  {
    name,
    email,
  }: {
    name: string;
    email: string;
  },
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) throw { status: 401, toast: "Unauthorized" };

    const { id } = jwt.decode(token) as { id: string };
    if (!id) throw { status: 400, toast: "Invalid session" };

    await db.update(affiliate).set({ name, email }).where(eq(affiliate.id, id));
    revalidatePath(`/affiliate/${orgId}/dashboard/profile`);
    return { ok: true };
  } catch (err) {
    console.error("updateAffiliateProfile error:", err);
    return returnError(err);
  }
}

export async function validateCurrentPassword(currentPassword: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) throw { status: 401, toast: "Unauthorized" };

    const { id } = jwt.decode(token) as { id: string };
    if (!id) throw { status: 400, toast: "Invalid session" };

    const record = await db.query.affiliate.findFirst({
      where: eq(affiliate.id, id),
    });
    if (!record) throw { status: 404, toast: "User not found" };

    const isMatch = await bcrypt.compare(currentPassword, record.password);
    if (!isMatch) throw { status: 403, toast: "Incorrect current password" };

    return { ok: true };
  } catch (err) {
    console.error("validateCurrentPassword error:", err);
    return returnError(err);
  }
}
export async function updateAffiliatePassword(newPassword: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) throw { status: 401, toast: "Unauthorized" };

    const { id } = jwt.decode(token) as { id: string };
    if (!id) throw { status: 400, toast: "Invalid session" };

    const hashed = await bcrypt.hash(newPassword, 10);
    await db
      .update(affiliate)
      .set({ password: hashed })
      .where(eq(affiliate.id, id));

    return { ok: true };
  } catch (err) {
    console.error("updateAffiliatePassword error:", err);
    return returnError(err);
  }
}
