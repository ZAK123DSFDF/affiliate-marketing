import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";
const isProduction = process.env.NODE_ENV === "production";
export const authClient = createAuthClient({
  baseURL: isProduction
    ? "https://affiliate-marketing-ten.vercel.app"
    : "http://myapp.test:3000",
  plugins: [organizationClient()],
});
