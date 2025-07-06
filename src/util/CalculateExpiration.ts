import { addDays, addWeeks, addMonths, addYears } from "date-fns";

export function calculateExpirationDate(
  baseDate: Date,
  durationValue: number,
  durationUnit: string,
): Date {
  switch (durationUnit) {
    case "day":
      return addDays(baseDate, durationValue);
    case "week":
      return addWeeks(baseDate, durationValue);
    case "month":
      return addMonths(baseDate, durationValue);
    case "year":
      return addYears(baseDate, durationValue);
    default:
      return addDays(baseDate, 7);
  }
}
