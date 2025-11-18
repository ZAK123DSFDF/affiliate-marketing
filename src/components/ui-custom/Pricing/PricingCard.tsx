import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function PricingCard({
  title,
  price,
  oldPrice,
  discount,
  features,
  buttonText,
  disabled,
  highlight,
  onClick, // 👈 added
  pendingMessage,
}: {
  title: string
  price: string
  oldPrice?: string | null
  discount?: number | null
  features: string[]
  buttonText: string
  disabled?: boolean
  highlight?: boolean
  onClick?: () => void // 👈 added
  pendingMessage?: string | null
}) {
  return (
    <Card
      className={cn(
        "w-[300px] rounded-2xl transition-all duration-200 hover:scale-[1.02]",
        highlight
          ? "bg-zinc-900 text-white border border-primary shadow-xl"
          : "bg-background"
      )}
    >
      <CardHeader className="text-center space-y-2">
        <CardTitle
          className={cn("text-2xl font-semibold", highlight && "text-white")}
        >
          {title}
        </CardTitle>

        <div className="flex flex-col items-center justify-center relative">
          {oldPrice && (
            <span
              className={cn(
                "text-gray-400 line-through text-lg",
                highlight && "text-gray-300/70"
              )}
            >
              {oldPrice}
            </span>
          )}
          <p
            className={cn(
              "text-3xl font-bold mt-1",
              highlight && "text-primary-foreground"
            )}
          >
            {price}
          </p>

          {discount && (
            <span
              className={cn(
                "absolute top-0 right-[-2] bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-md",
                highlight && "bg-green-400 text-black"
              )}
            >
              Save {discount}%
            </span>
          )}
        </div>
      </CardHeader>

      <Separator className={cn("my-3", highlight && "bg-white/20")} />

      <CardContent>
        <ul className="text-sm space-y-2 text-left mx-auto max-w-xs">
          {features.map((f) => {
            const featuresToShowCrossForPro = [
              "1 organization",
              "Up to 3 team member invitations",
            ]

            const shouldShowCross =
              title === "Pro" &&
              featuresToShowCrossForPro.some((crossFeature) =>
                f.includes(crossFeature)
              )

            return (
              <li
                key={f}
                className={cn(
                  "flex items-center gap-2",
                  highlight
                    ? "text-gray-100"
                    : shouldShowCross
                      ? "text-red-500"
                      : "text-muted-foreground"
                )}
              >
                <span>{shouldShowCross ? "❌" : "✔️"}</span>
                <span>{f}</span>
              </li>
            )
          })}
        </ul>
      </CardContent>

      <CardFooter className="mt-6 flex flex-col">
        <Button
          disabled={disabled}
          onClick={onClick} // 👈 attach it here
          variant={highlight ? "secondary" : "default"}
          className={cn(
            "w-full font-medium",
            disabled && "opacity-60 cursor-not-allowed"
          )}
        >
          {buttonText}
        </Button>
        {pendingMessage && (
          <p className="text-sm text-yellow-600 mt-2 text-center">
            {pendingMessage}
          </p>
        )}
      </CardFooter>
    </Card>
  )
}
