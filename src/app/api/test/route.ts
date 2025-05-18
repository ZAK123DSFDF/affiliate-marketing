// app/api/check/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";

export async function POST() {
  console.log("received incoming message");
  try {
    // Test user insertion
    await db.insert(users).values({
      email: "test-" + Date.now() + "@gmail.com",
      name: "test-" + Date.now(),
      age: 28,
    });

    return NextResponse.json({
      success: true,
      message: "User created successfully",
    });
  } catch (error: any) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error,
      },
      { status: 500 },
    );
  }
  // console.log("this works");
  // await db.insert(users).values({
  //   email: "test-" + Date.now() + "@gmail.com",
  //   name: "test-" + Date.now(),
  //   age: 28,
  // });
  // return NextResponse.json({
  //   success: true,
  // });
}
