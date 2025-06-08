"use server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const checkAuth = async () => {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");
  if (!tokenCookie) {
    return { isAuthenticated: false };
  }

  const token = tokenCookie.value;
  const decoded = jwt.decode(token);

  if (decoded) {
    return {
      isAuthenticated: true,
      id: (decoded as any).user,
      email: (decoded as any).email,
      role: (decoded as any).role,
    };
  }

  return { isAuthenticated: false };
};
