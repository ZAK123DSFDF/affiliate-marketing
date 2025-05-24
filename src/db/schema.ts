import {
  pgTable,
  uuid,
  varchar,
  integer,
  pgEnum,
  text,
} from "drizzle-orm/pg-core";

// Define enum for payment providers
export const paymentProviderEnum = pgEnum("payment_provider", [
  "stripe",
  "paddle",
  "lemon_squeezy",
]);

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  age: integer().notNull(),
  email: text().notNull().unique(),
  paymentProvider: paymentProviderEnum().notNull(),
});
