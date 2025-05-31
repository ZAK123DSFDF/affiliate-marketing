import { createAuthClient } from "better-auth/react"
const isProduction = process.env.NODE_ENV === "production"
export const authClient = createAuthClient({
  baseURL: isProduction
    ? "https://affiliate-marketing-ten.vercel.app"
    : "http://localhost:3000",
})
