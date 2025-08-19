"use server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { returnError } from "@/lib/errorHandler";

export const verifyToken = async () => {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("token");
    const token = tokenCookie?.value;
    if (!token) {
      throw {
        status: 401, // Unauthorized
        error: "Authentication token missing",
        toast: "Please log in to continue.",
      };
    }
    const verified = jwt.verify(token, process.env.secret as string);
    if (!verified) {
      throw {
        status: 401, // Unauthorized
        error: "Authentication token expired",
        toast: "Your session has expired. Please log in again.",
      };
    }
    return token;
  } catch (error: any) {
    console.error("Error in auth:", error);
    return returnError(error);
  }
};
