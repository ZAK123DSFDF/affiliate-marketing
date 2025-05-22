import { pgTable, uuid, varchar, integer, pgEnum } from "drizzle-orm/pg-core";

// 1. First define the enum type
export const paymentProviderEnum = pgEnum("payment_provider", [
  "stripe",
  "lemon_squeezy",
  "paddle",
]);

// 2. Then add it to your table
export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  paymentProvider: paymentProviderEnum("payment_provider").default("paddle"),
});
