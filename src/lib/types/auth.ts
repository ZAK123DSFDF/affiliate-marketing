import { affiliate, user } from "@/db/schema";

export type SafeUserData = Omit<typeof user.$inferSelect, "password">;
export type SafeAffiliateData = Omit<typeof affiliate.$inferSelect, "password">;
