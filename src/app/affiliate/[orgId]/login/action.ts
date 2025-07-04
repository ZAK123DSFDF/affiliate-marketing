"use server";

import { db } from "@/db/drizzle";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { returnError } from "@/lib/errorHandler";

export const LoginAffiliateServer = async ({
  email,
  password,
  organizationId,
}: {
  email: string;
  password: string;
  organizationId: string;
}) => {
  try {
    if (!email || !password || !organizationId) {
      throw {
        status: 400,
        error: "Email, password, and organization ID are required.",
        toast: "Please enter your login credentials.",
        fields: {
          email: !email ? "Email is required" : "",
          password: !password ? "Password is required" : "",
          organizationId: !organizationId ? "Organization is required" : "",
        },
      };
    }

    const cookieStore = await cookies();

    const existingAffiliate = await db.query.affiliate.findFirst({
      where: (a, { and, eq }) =>
        and(eq(a.email, email), eq(a.organizationId, organizationId)),
    });

    if (!existingAffiliate) {
      throw {
        status: 404,
        error: "Affiliate not found.",
        toast:
          "Invalid credentials. Please check your email, password, and organization.",
        fields: { email: "Affiliate not found in this organization" },
      };
    }

    const validPassword = await bcrypt.compare(
      password,
      existingAffiliate.password,
    );

    if (!validPassword) {
      throw {
        status: 401,
        error: "Invalid password.",
        toast: "Invalid credentials. Please check your email and password.",
        fields: { password: "Invalid password" },
      };
    }

    const token = jwt.sign(
      {
        id: existingAffiliate.id,
        email: existingAffiliate.email,
        type: existingAffiliate.type,
        organizationId: existingAffiliate.organizationId,
      },
      process.env.SECRET_KEY as string,
      { expiresIn: "7d" },
    );

    cookieStore.set({
      name: "token",
      value: token,
      httpOnly: true,
    });

    return {
      user: existingAffiliate,
      token,
    };
  } catch (error: any) {
    console.error("Affiliate Login Error:", error);
    return returnError(error);
  }
};
