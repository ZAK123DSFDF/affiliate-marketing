"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { OrgHeader } from "@/components/ui-custom/OrgHeader"

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 ease-in-out",
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      {/* narrowed container so header content is not edge-to-edge */}
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
        {/* OrgHeader replaces AffiliateSaaS title */}
        <div className="flex items-center">
          <OrgHeader affiliate={false} isPreview={false} />
        </div>

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
  )
}

export default Header
