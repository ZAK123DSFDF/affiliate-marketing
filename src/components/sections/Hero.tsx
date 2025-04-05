import React from "react";
import AnimatedButton from "@/components/ui-custom/AnimatedButton";

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
          <div className="inline-block rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground mb-4">
            Introducing AffiliateSaaS Platform
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
            The <span className="text-gradient">Simplest</span> Way to Grow Your
            SaaS With Affiliate Marketing
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
            Create, track, and scale your affiliate program with an elegant
            platform designed specifically for SaaS businesses.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <AnimatedButton href="#" size="lg" className="w-full sm:w-auto">
              Start for Free
            </AnimatedButton>
            <AnimatedButton
              href="#how-it-works"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              See How It Works
            </AnimatedButton>
          </div>

          <div className="pt-12 opacity-90">
            <p className="text-sm text-muted-foreground mb-4">
              Trusted by innovative SaaS companies
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8">
              {[
                "Company 1",
                "Company 2",
                "Company 3",
                "Company 4",
                "Company 5",
              ].map((company, index) => (
                <div
                  key={index}
                  className="text-lg font-medium text-foreground/80"
                >
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
