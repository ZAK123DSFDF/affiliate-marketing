import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";
config({ path: ".env" });
export default defineConfig({
  out: "./migrations",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
