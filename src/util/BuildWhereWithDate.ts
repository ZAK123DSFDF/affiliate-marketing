import { and, or, SQL } from "drizzle-orm"
import { resolveDateCondition, WithCreatedAtColumn } from "@/util/DateFilter"

export function buildWhereWithDate(
  baseConditions: SQL[],
  value: WithCreatedAtColumn,
  year?: number,
  month?: number,
  capLast = false,
  months?: { year: number; month: number }[]
): SQL {
  let dateCondition: SQL | undefined

  if (months && months.length > 0) {
    const monthConds = months
      .map(({ year, month }) => resolveDateCondition(year, month, value))
      .filter(Boolean) as SQL[]
    if (monthConds.length) dateCondition = or(...monthConds)
  } else {
    dateCondition = resolveDateCondition(year, month, value, capLast)
  }

  const conditions = [...baseConditions]
  if (dateCondition) conditions.push(dateCondition)

  return and(...conditions) as SQL
}
