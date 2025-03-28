import React from "react";
import AnimatedButton from "../ui/AnimatedButton";

const CTA = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 to-background"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-primary/10 filter blur-3xl opacity-70 animate-float"></div>
      </div>

      <div className="container mx-auto max-w-4xl">
        <div className="text-center space-y-8 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Ready to Grow Your SaaS with{" "}
            <span className="text-gradient">Affiliate Marketing?</span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of SaaS businesses that are accelerating their growth
            through our affiliate platform.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
            <AnimatedButton href="#" size="lg">
              Start Your Free Trial
            </AnimatedButton>
            <AnimatedButton variant="outline" size="lg">
              View Dashboard Demo
            </AnimatedButton>
          </div>

          <p className="text-muted-foreground">
            No credit card required. 14-day free trial.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
