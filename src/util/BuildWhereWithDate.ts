import { and, SQL } from "drizzle-orm";
import { resolveDateCondition, WithCreatedAtColumn } from "@/util/DateFilter";

export function buildWhereWithDate(
  baseConditions: SQL[], // 👈 array instead of single
  value: WithCreatedAtColumn,
  year?: number,
  month?: number,
  capLast = false,
): SQL {
  const dateCondition = resolveDateCondition(year, month, value, capLast);
  const conditions = [...baseConditions];
  if (dateCondition) conditions.push(dateCondition);

  return and(...conditions) as SQL;
}
