import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { ResponseData } from "@/lib/types/response"
import { UnpaidMonth } from "@/lib/types/unpaidMonth"

interface UseSearchOptions {
  enabled?: boolean
}

interface SearchResult<TData> {
  data: TData | undefined
  error: string | undefined
  isPending: boolean
  queryResult: UseQueryResult<{ data?: TData; toast?: string }>
}

export function useSearch<Args extends unknown[], TData>(
  queryKey: (string | number | undefined | UnpaidMonth[])[],
  fetchFn: (...args: Args) => Promise<ResponseData<TData>>,
  fetchArgs: Args,
  options?: UseSearchOptions
): SearchResult<TData> {
  const queryResult = useQuery<{ data?: TData; toast?: string }>({
    queryKey,
    queryFn: async () => {
      const res = await fetchFn(...fetchArgs)
      if (res.ok) return { data: res.data }
      return { toast: res.toast }
    },
    enabled: options?.enabled ?? true,
  })

  return {
    data: queryResult.data?.data,
    error: queryResult.data?.toast,
    isPending: queryResult.isFetching,
    queryResult,
  }
}
