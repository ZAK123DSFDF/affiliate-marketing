import "dotenv/config";

import { users } from "@/db/schema";
import { db } from "@/db/drizzle"; // Changed from usersTable to users

async function main() {
  // Add first user
  await db.insert(users).values({
    name: "John Doe",
    age: 30,
    email: "john@example.com",
  });
  console.log("Added John");

  // Add second user
  await db.insert(users).values({
    name: "Jane Smith",
    age: 28,
    email: "jane@example.com",
  });
  console.log("Added Jane");

  // Get all users (simple version)
  const allUsers = await db.select().from(users);
  console.log("All users:", allUsers);
}

main().catch((err) => {
  console.error("Error seeding database:", err);
  process.exit(1);
});
