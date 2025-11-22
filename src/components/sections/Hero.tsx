import React from "react"
import AnimatedButton from "@/components/ui-custom/AnimatedButton"

const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/80 to-background/20"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 filter blur-3xl opacity-70 animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-blue-400/10 filter blur-3xl opacity-70 animate-float animation-delay-300"></div>
      </div>

      <div className="container mx-auto max-w-5xl">
        <div className="text-center space-y-6 animate-fade-in">
          {/* NEW HEADLINE */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
            Launch Your <span className="text-gradient">Affiliate Program</span>{" "}
            in Minutes
          </h1>

          {/* NEW DESCRIPTION */}
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
            A simple, powerful platform to track referrals, monitor performance,
            and grow your SaaS without any complexity.
          </p>

          {/* Only ONE main CTA */}
          <div className="flex justify-center items-center pt-4">
            <AnimatedButton href="/signup" size="lg" className="w-auto">
              Start for Free
            </AnimatedButton>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
