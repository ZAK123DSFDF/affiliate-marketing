import { useQuery } from "@tanstack/react-query";
import { ResponseData } from "@/lib/types/response";
import { UnpaidMonth } from "@/lib/types/unpaidMonth";
export function useSearch<Args extends unknown[], TData>(
  queryKey: (string | number | undefined | UnpaidMonth[])[],
  fetchFn: (...args: Args) => Promise<ResponseData<TData>>,
  fetchArgs: Args,
  options?: { enabled?: boolean },
) {
  return useQuery<TData>({
    queryKey,
    queryFn: () =>
      fetchFn(...fetchArgs).then((res) => (res.ok ? res.data : ([] as TData))),
    enabled: options?.enabled ?? true,
  });
}
