import { toast } from "@/hooks/use-toast"

type ToastType = "success" | "error"

export function showStandaloneToast({
  type,
  title,
  description,
}: {
  type: ToastType
  title: string
  description: string
}) {
  toast({
    title,
    description,
    variant: type === "error" ? "destructive" : "default",
  })
}
