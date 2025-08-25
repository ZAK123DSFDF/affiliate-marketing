import React from "react"
import TestimonialCard from "@/components/ui-custom/TestimonialCard"

const testimonials = [
  {
    quote:
      "AffiliateSaaS transformed our partner program. What used to take hours of manual work each week now happens automatically. Our Affiliates revenue has increased by 215% in just 6 months.",
    author: "Sarah Johnson",
    role: "CMO",
    company: "TechFlow SaaS",
  },
  {
    quote:
      "The elegant design and intuitive interface make managing our Affiliates a breeze. It's the perfect blend of simplicity and powerful features that we couldn't find anywhere else.",
    author: "Michael Chen",
    role: "Head of Growth",
    company: "AnalyticsPro",
  },
  {
    quote:
      "As someone who's tried every Affiliates platform out there, I can confidently say this is the best solution for SaaS companies. The integration was smooth and our Affiliates love the dashboard.",
    author: "Emma Williams",
    role: "Partnership Lead",
    company: "CloudSecurity",
  },
]

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Loved by SaaS Companies
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Hear from businesses that have transformed their growth with our
            affiliate platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`animate-fade-in animation-delay-${index * 200}`}
            >
              <TestimonialCard
                quote={testimonial.quote}
                author={testimonial.author}
                role={testimonial.role}
                company={testimonial.company}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
