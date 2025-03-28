import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300 ease-in-out",
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm"
          : "bg-transparent",
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-semibold text-foreground">
          Affiliate<span className="text-primary">SaaS</span>
        </Link>

        <nav className="hidden md:flex space-x-8">
          <a
            href="#features"
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            How It Works
          </a>
          <a
            href="#testimonials"
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            Testimonials
          </a>
          <a
            href="#pricing"
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            Pricing
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <Link
            href="/login"
            className="text-foreground/80 hover:text-foreground transition-colors hidden md:inline-block"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition-colors shadow-sm"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
