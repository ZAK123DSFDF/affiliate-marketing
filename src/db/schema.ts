import { pgTable, uuid, varchar, integer, pgEnum } from "drizzle-orm/pg-core";

// Define enum for payment providers
export const paymentProviderEnum = pgEnum("payment_provider", [
  "stripe",
  "paddle",
  "lemon_squeezy",
]);

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  paymentProvider: paymentProviderEnum("payment_provider").notNull(),
});
