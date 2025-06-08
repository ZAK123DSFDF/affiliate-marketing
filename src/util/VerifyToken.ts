"use server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const verifyToken = async () => {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("token");
    const token = tokenCookie?.value;
    if (!token) {
      throw new Error("User is not authenticated");
    }
    const verified = jwt.verify(token, process.env.secret as string);
    if (!verified) {
      throw new Error("User is not authenticated");
    }
    return token;
  } catch (error: any) {
    console.error("Error in auth:", error);
    throw new Error(`Error auth: ${error?.message}`);
  }
};
