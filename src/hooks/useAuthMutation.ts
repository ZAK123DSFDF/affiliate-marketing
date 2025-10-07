import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { useCustomToast } from "@/components/ui-custom/ShowCustomToast"
import { useRouter } from "next/navigation"

// 👇 AuthResponse definition
export interface AuthResponse {
  ok: boolean
  status?: number
  message?: string
  toast?: string
  fields?: Record<string, string> | null
  redirectUrl?: string
}

export function useAuthMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<AuthResponse>,
  options?: Omit<
    UseMutationOptions<AuthResponse, unknown, TVariables>,
    "mutationFn" | "onSuccess"
  > & {
    disableSuccessToast?: boolean
    disableErrorToast?: boolean
    affiliate?: boolean
    redirectUrl?: string
    onSuccess?: (
      data: AuthResponse,
      variables: TVariables,
      context: unknown
    ) => void
  }
) {
  const { showCustomToast } = useCustomToast()
  const router = useRouter()

  return useMutation<AuthResponse, unknown, TVariables>({
    mutationFn,
    ...options,
    onSuccess: (res, variables, context) => {
      if (res.ok) {
        if (!options?.disableSuccessToast) {
          showCustomToast({
            type: "success",
            title: "Success",
            description: res.message || "Done",
            affiliate: options?.affiliate ?? false,
          })
        }
        if (res.redirectUrl) {
          router.push(res.redirectUrl)
        } else if (options?.redirectUrl) {
          router.push(options.redirectUrl)
        }
      } else {
        if (!options?.disableErrorToast) {
          showCustomToast({
            type: "error",
            title: "Failed",
            description: res.toast || "Something went wrong",
            affiliate: options?.affiliate ?? false,
          })
        }
      }

      options?.onSuccess?.(res, variables, context)
    },
  })
}
