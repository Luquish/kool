"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b-2 border-secondary">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <h1 className="text-3xl font-black text-primary tracking-tighter font-display">KOOL</h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="#features" className="text-secondary font-medium hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="#testimonials" className="text-secondary font-medium hover:text-primary transition-colors">
            Artists
          </Link>
          <Link href="#pricing" className="text-secondary font-medium hover:text-primary transition-colors">
            Pricing
          </Link>
          <Link href="#about" className="text-secondary font-medium hover:text-primary transition-colors">
            About
          </Link>
          <Button className="bg-primary hover:bg-primary/90 text-white">Get Started</Button>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-secondary" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b-2 border-secondary">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link
              href="#features"
              className="text-secondary font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              className="text-secondary font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Artists
            </Link>
            <Link
              href="#pricing"
              className="text-secondary font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="#about"
              className="text-secondary font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Button className="bg-primary hover:bg-primary/90 text-white w-full">Get Started</Button>
          </div>
        </div>
      )}
    </header>
  )
}
