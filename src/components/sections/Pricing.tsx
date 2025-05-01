import React from "react";
import PriceCard from "@/components/ui-custom/PriceCard";

const pricingPlans = [
  {
    name: "Starter",
    price: "$49",
    description:
      "Perfect for early-stage SaaS businesses launching their first Affiliates program.",
    features: [
      { text: "Up to 50 Affiliates", included: true },
      { text: "Basic Affiliates dashboard", included: true },
      { text: "Manual payouts", included: true },
      { text: "Email support", included: true },
      { text: "Custom Affiliates portal", included: false },
      { text: "API access", included: false },
      { text: "Automated payouts", included: false },
      { text: "Advanced analytics", included: false },
    ],
    buttonText: "Get Started",
    popular: false,
  },
  {
    name: "Growth",
    price: "$149",
    description:
      "Ideal for growing SaaS companies looking to scale their Affiliates programs.",
    features: [
      { text: "Up to 200 Affiliates", included: true },
      { text: "Advanced Affiliates dashboard", included: true },
      { text: "Automated payouts", included: true },
      { text: "Priority email support", included: true },
      { text: "Custom Affiliates portal", included: true },
      { text: "API access", included: true },
      { text: "Multiple user accounts", included: false },
      { text: "Custom integrations", included: false },
    ],
    buttonText: "Get Started",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$399",
    description:
      "Comprehensive solution for established SaaS businesses with large Affiliates networks.",
    features: [
      { text: "Unlimited Affiliates", included: true },
      { text: "White-label Affiliates portal", included: true },
      { text: "Advanced commission rules", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "Custom integrations", included: true },
      { text: "Multiple user accounts", included: true },
      { text: "API access", included: true },
      { text: "Analytics API", included: true },
    ],
    buttonText: "Contact Sales",
    popular: false,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the plan that fits your business needs. No hidden fees, no
            surprises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`animate-fade-in animation-delay-${index * 200}`}
            >
              <PriceCard
                name={plan.name}
                price={plan.price}
                description={plan.description}
                features={plan.features}
                buttonText={plan.buttonText}
                popular={plan.popular}
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-12 text-muted-foreground animate-fade-in">
          All plans include a 14-day free trial. No credit card required.
        </div>
      </div>
    </section>
  );
};

export default Pricing;
