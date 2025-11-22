import React from "react"
import TestimonialCard from "@/components/ui-custom/TestimonialCard"

const testimonials = [
  {
    quote:
      "AffiliateSaaS transformed our partner program. What used to take hours of manual work each week now happens automatically. Our affiliate revenue has increased by 215% in just 6 months.",
    author: "Sarah Johnson",
    role: "CMO",
    company: "TechFlow SaaS",
  },
  {
    quote:
      "The elegant design and intuitive interface make managing our affiliates a breeze. It's the perfect blend of simplicity and powerful features.",
    author: "Michael Chen",
    role: "Head of Growth",
    company: "AnalyticsPro",
  },
  {
    quote:
      "As someone who's tried every affiliate platform out there, I can confidently say this is the best solution for SaaS companies. Integration was smooth and our partners love the dashboard.",
    author: "Emma Williams",
    role: "Partnership Lead",
    company: "CloudSecurity",
  },
  {
    quote:
      "Switching to AffiliateSaaS was the best decision we made this year. The automation alone saves us dozens of hours every month.",
    author: "David Miller",
    role: "Founder",
    company: "ScaleOps",
  },
]

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 px-6">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Loved by SaaS Companies
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Hear from businesses that have transformed their growth with our
            affiliate platform.
          </p>
        </div>

        {/* 2x2 layout: 2 top, 2 bottom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
