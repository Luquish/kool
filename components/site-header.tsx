"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function SiteHeader() {
  // This would normally come from your auth context/provider
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Toggle login state for demo purposes
  const toggleLoginState = () => {
    setIsLoggedIn(!isLoggedIn)
  }

  // Effect to detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <header 
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-gradient-to-b from-cream/95 to-cream/80 backdrop-blur-sm shadow-sm' 
          : 'bg-cream'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="kool-brand text-3xl">KOOL</span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/explore" className="text-black hover:text-orange-500 transition-colors text-sm">
                Explore
              </Link>
              <Link href="/dashboard" className="text-black hover:text-orange-500 transition-colors text-sm">
                Dashboard
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-6">
            <Link
              href="/para-artistas"
              className="hidden md:block text-black hover:text-orange-500 transition-colors text-sm"
            >
              Para Artistas
            </Link>

            <div className="h-6 w-px bg-gray-400 hidden md:block"></div>

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                      <AvatarFallback className="bg-orange-500 text-white text-xs">KL</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem>
                    <span>My<span className="kool-brand">KOOL</span></span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleLoginState}>
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" className="text-black hover:text-orange-500 text-sm" onClick={toggleLoginState}>
                  Log In
                </Button>
                <Button className="bg-black hover:bg-gray-800 text-white rounded-full text-sm px-4 py-1 h-auto font-medium">
                  Sign Up
                </Button>
              </>
            )}            
          </div>
        </div>
      </div>
    </header>
  )
}
