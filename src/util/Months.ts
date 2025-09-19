// lib/utils/months.ts

export interface FilterInput {
  year?: number
  month?: number
}

export interface MonthInput {
  year: number
  month?: number
  unpaid?: number
}

export interface NormalizedMonth {
  year: number
  month?: number
}
export function getFilterMonths(filters: FilterInput): NormalizedMonth[] {
  if (!filters.year) return []
  if (filters.month) return [{ year: filters.year, month: filters.month }]
  return [{ year: filters.year }]
}
export function getSelectedMonths(months: MonthInput[]): NormalizedMonth[] {
  return months.map(({ year, month }) => ({ year, month }))
}
export function getNormalizedMonths(
  isUnpaidMode: boolean,
  selectedMonths: MonthInput[],
  filters: FilterInput
): NormalizedMonth[] {
  return isUnpaidMode
    ? getSelectedMonths(selectedMonths)
    : getFilterMonths(filters)
}
