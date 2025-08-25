import { affiliate } from "@/db/schema"

export type SafeAffiliateData = Omit<typeof affiliate.$inferSelect, "password">
