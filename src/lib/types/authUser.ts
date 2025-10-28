import { user, team } from "@/db/schema"

export type SafeUserData = Omit<typeof user.$inferSelect, "password">
export type SafeUserWithCapabilities = SafeUserData & {
  canChangeEmail: boolean
  canChangePassword: boolean
}
export type safeTeamData = Omit<typeof team.$inferSelect, "password">
export type SafeTeamWithCapabilities = safeTeamData & {
  canChangeEmail: boolean
  canChangePassword: boolean
}
