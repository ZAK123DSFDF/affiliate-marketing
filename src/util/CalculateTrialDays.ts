export function calculateTrialDays(
  interval: string,
  frequency: number
): number {
  if (interval === "day") return frequency
  if (interval === "week") return frequency * 7
  if (interval === "month") return frequency * 30
  if (interval === "year") return frequency * 365
  return 0
}
