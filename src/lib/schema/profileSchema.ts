import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(1, "Username is required"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
});
