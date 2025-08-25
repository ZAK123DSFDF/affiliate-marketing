import { and, gte, lt, SQL, AnyColumn } from "drizzle-orm"

export type WithCreatedAtColumn = { createdAt: AnyColumn }

const dateFilter = (
  value: WithCreatedAtColumn,
  year?: number,
  month?: number
): SQL | undefined => {
  if (year && month) {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 1)
    return and(gte(value.createdAt, startDate), lt(value.createdAt, endDate))
  } else if (year) {
    const startDate = new Date(year, 0, 1)
    const endDate = new Date(year + 1, 0, 1)
    return and(gte(value.createdAt, startDate), lt(value.createdAt, endDate))
  }
  return undefined
}

const capLast1000Days = (value: WithCreatedAtColumn): SQL => {
  const today = new Date()
  const past1000Days = new Date(today.getTime() - 1000 * 24 * 60 * 60 * 1000)
  return gte(value.createdAt, past1000Days)
}

export const resolveDateCondition = (
  year: number | undefined,
  month: number | undefined,
  value: WithCreatedAtColumn,
  capLast = false
): SQL | undefined => {
  const filter = dateFilter(value, year, month)
  if (filter) return filter
  if (capLast) return capLast1000Days(value)
  return undefined
}
