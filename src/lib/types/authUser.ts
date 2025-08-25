import { user } from "@/db/schema"

export type SafeUserData = Omit<typeof user.$inferSelect, "password">
