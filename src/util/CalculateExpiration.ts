import { addDays, addWeeks, addMonths, addYears } from "date-fns"

export function calculateExpirationDate(
  baseDate: Date,
  durationValue: number | null,
  durationUnit: string | null
): Date {
  // Provide default values if null
  const value = durationValue ?? 0
  const unit = durationUnit ?? "day"

  switch (unit) {
    case "day":
      return addDays(baseDate, value)
    case "week":
      return addWeeks(baseDate, value)
    case "month":
      return addMonths(baseDate, value)
    case "year":
      return addYears(baseDate, value)
    default:
      return addDays(baseDate, 7)
  }
}
