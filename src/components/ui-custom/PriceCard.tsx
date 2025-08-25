import React from "react"
import { cn } from "@/lib/utils"
import AnimatedButton from "./AnimatedButton"

interface PriceFeature {
  text: string
  included: boolean
}

interface PriceCardProps {
  popular?: boolean
  name: string
  price: string
  description: string
  features: PriceFeature[]
  buttonText: string
  className?: string
  period?: string
}

const PriceCard: React.FC<PriceCardProps> = ({
  popular = false,
  name,
  price,
  description,
  features,
  buttonText,
  className,
  period = "month",
}) => {
  return (
    <div
      className={cn(
        "glass-card rounded-2xl transition-all duration-300 overflow-hidden",
        popular
          ? "border-primary/30 shadow-lg shadow-primary/10 scale-105"
          : "hover:shadow-md",
        className
      )}
    >
      {popular && (
        <div className="bg-primary text-primary-foreground py-1.5 text-center text-sm font-medium">
          Most Popular
        </div>
      )}

      <div className="p-8">
        <h3 className="text-xl font-medium mb-2">{name}</h3>
        <div className="mb-4">
          <span className="text-4xl font-semibold">{price}</span>
          {price !== "Free" && (
            <span className="text-muted-foreground">/{period}</span>
          )}
        </div>
        <p className="text-muted-foreground mb-6">{description}</p>

        <AnimatedButton
          className="w-full mb-8"
          variant={popular ? "primary" : "outline"}
        >
          {buttonText}
        </AnimatedButton>

        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <div
                className={`mt-0.5 mr-3 ${feature.included ? "text-primary" : "text-muted-foreground/50"}`}
              >
                {feature.included ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-check"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-minus"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                )}
              </div>
              <span
                className={
                  feature.included
                    ? "text-foreground/90"
                    : "text-muted-foreground/60"
                }
              >
                {feature.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PriceCard
