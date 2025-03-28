import React from "react";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: "01",
    title: "Set Up Your Program",
    description:
      "Define your commission structure, customize your affiliate dashboard, and set up payment methods.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1470&auto=format&fit=crop",
    alt: "Setting up affiliate program",
  },
  {
    number: "02",
    title: "Invite Affiliates",
    description:
      "Invite partners through email or let them sign up through your custom affiliate portal.",
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1470&auto=format&fit=crop",
    alt: "Inviting affiliates",
  },
  {
    number: "03",
    title: "Track Performance",
    description:
      "Monitor clicks, conversions, and revenue in real-time through our intuitive dashboard.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1415&auto=format&fit=crop",
    alt: "Tracking affiliate performance",
  },
  {
    number: "04",
    title: "Automatic Payouts",
    description:
      "Let our system handle commission calculations and payments based on your schedule.",
    image:
      "https://images.unsplash.com/photo-1565514020179-026b92b2d169?q=80&w=1470&auto=format&fit=crop",
    alt: "Automatic affiliate payouts",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 px-6 bg-secondary/50">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Launch your affiliate program in minutes with our seamless four-step
            process.
          </p>
        </div>

        <div className="space-y-20">
          {steps.map((step, index) => (
            <div
              key={index}
              className={cn(
                "flex flex-col lg:flex-row items-center gap-10 animate-fade-in",
                index % 2 === 1 ? "lg:flex-row-reverse" : "",
              )}
            >
              <div className="flex-1 lg:px-6">
                <div className="inline-block text-4xl font-bold text-primary/20 mb-2">
                  {step.number}
                </div>
                <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-lg">
                  {step.description}
                </p>
              </div>
              <div className="flex-1">
                <div className="bg-white p-2 rounded-2xl shadow-md overflow-hidden">
                  <img
                    src={step.image}
                    alt={step.alt}
                    className="w-full h-auto rounded-xl object-cover aspect-video"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
