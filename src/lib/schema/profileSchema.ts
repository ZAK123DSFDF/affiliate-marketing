import { z } from "zod"

export const affiliateProfileSchema = z.object({
  name: z.string().min(1, "Username is required"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  paypalEmail: z
    .string()
    .min(1, "PayPal email is required")
    .email("Invalid PayPal email"),
})
export const userProfileSchema = affiliateProfileSchema.omit({
  paypalEmail: true,
})
export const teamProfileSchema = userProfileSchema
