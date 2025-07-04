// app/actions/auth/getUser.ts
"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { returnError } from "@/lib/errorHandler";
import { UserDataResponse } from "@/lib/types/auth";

export const getUserData = async (): Promise<UserDataResponse> => {
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

    const userData = await db.query.user.findFirst({
      where: eq(user.id, decoded.id),
      columns: {
        password: false, // Explicitly exclude password
      },
    });

    if (!userData) {
      throw {
        status: 404,
        error: "User not found",
        toast: "Your account could not be found.",
      };
    }

    return { ok: true, data: userData };
  } catch (err) {
    console.error("getUserData error:", err);
    return returnError(err) as UserDataResponse;
  }
};
