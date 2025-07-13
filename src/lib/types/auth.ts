import {affiliate, user} from "@/db/schema";

export type SafeUserData = Omit<typeof user.$inferSelect, "password">;
export type SafeAffiliateData = Omit<typeof affiliate.$inferSelect, "password">;
export type UserDataResponse =
  | { ok: true; data: SafeUserData }
  | { ok: false; error: string; status: number; toast?: string };
export type AffiliateDataResponse =
    | { ok: true; data: SafeAffiliateData }
    | { ok: false; error: string; status: number; toast?: string };