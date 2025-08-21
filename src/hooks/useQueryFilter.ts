import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useMemo } from "react";

type OrderDir = "asc" | "desc";

export function useQueryFilter(
  keys: {
    yearKey?: string;
    monthKey?: string;
    orderByKey?: string;
    orderDirKey?: string;
  } = {},
) {
  const {
    yearKey = "year",
    monthKey = "month",
    orderByKey = "orderBy",
    orderDirKey = "orderDir",
  } = keys;

  const router = useRouter();
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  const initialFilters = useMemo(
    () => ({
      year: params[yearKey] ? Number(params[yearKey]) : undefined,
      month: params[monthKey] ? Number(params[monthKey]) : undefined,
      orderBy: params[orderByKey] ?? undefined,
      orderDir: params[orderDirKey] ?? undefined,
    }),
    [params, yearKey, monthKey, orderByKey, orderDirKey],
  );

  const [filters, setFilters] = useState(initialFilters);

  const updateFilters = useCallback(
    (newFilters: Partial<typeof initialFilters>) => {
      const merged = { ...filters, ...newFilters };
      if (merged.year === undefined) {
        merged.month = undefined;
      }
      setFilters(merged);

      const newParams = new URLSearchParams(searchParams.toString());

      if (merged.year !== undefined)
        newParams.set(yearKey, String(merged.year));
      else newParams.delete(yearKey);

      if (merged.month !== undefined)
        newParams.set(monthKey, String(merged.month));
      else newParams.delete(monthKey);

      if (merged.orderBy) newParams.set(orderByKey, merged.orderBy);
      else newParams.delete(orderByKey);

      if (merged.orderDir) newParams.set(orderDirKey, merged.orderDir);
      else newParams.delete(orderDirKey);

      router.push(`?${newParams.toString()}`, { scroll: false });
    },
    [filters, router, searchParams, yearKey, monthKey, orderByKey, orderDirKey],
  );

  return { filters, setFilters: updateFilters };
}
