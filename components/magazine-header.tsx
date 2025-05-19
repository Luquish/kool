"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MagazineHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showJoke, setShowJoke] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 bg-white z-50 transition-shadow duration-200 border-b-2 border-secondary ${
      hasScrolled ? 'shadow-lg' : ''
    }`}>
      {/* Top utility bar */}
      <div className="border-b-2 border-secondary py-2 px-4 flex justify-between items-center text-sm">
        <div className="relative w-[100px] flex items-center">
          <Link 
            href="#" 
            className="text-secondary/70 hover:text-primary transition-colors duration-200 absolute whitespace-nowrap"
            onMouseEnter={() => setShowJoke(true)}
            onMouseLeave={() => setShowJoke(false)}
          >
            {showJoke ? "Just kidding!" : "Got A Tip?"}
          </Link>
        </div>
        <div className="flex-1 flex justify-center">
          <Link href="/" className="block">
            <Image
              src="/kool_logo.svg"
              alt="KOOL"
              width={200}
              height={60}
              className="transform -rotate-2"
            />
          </Link>
        </div>
        <div className="relative w-[200px] flex items-center justify-end space-x-4">
          <Link href="#" className="text-secondary/70 hover:text-primary">
            Log In
          </Link>
          <Link href="#" className="text-secondary/70 hover:text-primary">
            Subscribe
          </Link>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className="hidden md:flex items-center space-x-8 font-bold text-sm uppercase">
          <Link href="#features" className="hover:text-primary">
            Features
          </Link>
          <Link href="#artists" className="hover:text-primary">
            Artists
          </Link>
          <Link href="#about" className="hover:text-primary">
            About
          </Link>
          <Link href="#pricing" className="hover:text-primary">
            Pricing
          </Link>
          <Link href="#dashboard" className="hover:text-primary">
            Dashboard
          </Link>
        </nav>

        <div className="flex items-center">
          <Button className="bg-primary hover:bg-primary/90 text-white rounded-none">Start Free Trial</Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t-2 border-secondary">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4 font-bold text-sm uppercase">
            <Link href="#features" className="hover:text-primary py-2 border-b-2 border-secondary">
              Features
            </Link>
            <Link href="#artists" className="hover:text-primary py-2 border-b-2 border-secondary">
              Artists
            </Link>
            <Link href="#ai" className="hover:text-primary py-2 border-b-2 border-secondary">
              AI Tools
            </Link>
            <Link href="#pricing" className="hover:text-primary py-2 border-b-2 border-secondary">
              Pricing
            </Link>
            <Link href="#news" className="hover:text-primary py-2 border-b-2 border-secondary">
              News
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
