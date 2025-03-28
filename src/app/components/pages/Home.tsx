"use client";
import Hero from "@/app/components/sections/Hero";
import Features from "@/app/components/sections/Features";
import HowItWorks from "@/app/components/sections/HowItWorks";
import Testimonials from "@/app/components/sections/Testimonials";
import Pricing from "@/app/components/sections/Pricing";
import CTA from "@/app/components/sections/CTA";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <CTA />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
