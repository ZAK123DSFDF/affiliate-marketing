import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  baseURL: "http://myapp.test:3000",
});
