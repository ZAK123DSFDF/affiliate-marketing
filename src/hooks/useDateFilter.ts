import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useMemo } from "react";

export function useDateFilter(
  yearKey: string = "year",
  monthKey: string = "month",
) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  const initialDate = useMemo(
    () => ({
      year: params[yearKey] ? Number(params[yearKey]) : undefined,
      month: params[monthKey] ? Number(params[monthKey]) : undefined,
    }),
    [params, yearKey, monthKey],
  );

  const [selectedDate, setSelectedDate] = useState<{
    year?: number;
    month?: number;
  }>(initialDate);

  const handleDateChange = useCallback(
    (year?: number, month?: number) => {
      const newParams = new URLSearchParams(searchParams.toString());
      setSelectedDate({ year, month });

      if (year !== undefined) {
        newParams.set(yearKey, String(year));
        if (month !== undefined) {
          newParams.set(monthKey, String(month));
        } else {
          newParams.delete(monthKey);
        }
      } else {
        newParams.delete(yearKey);
        newParams.delete(monthKey);
      }

      router.push(`?${newParams.toString()}`);
    },
    [router, searchParams, yearKey, monthKey],
  );

  return {
    selectedDate,
    setSelectedDate,
    handleDateChange,
  };
}
