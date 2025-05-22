"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Menu, X, User, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import storage from "@/lib/storage"
import { usePathname } from "next/navigation"

export default function MagazineHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showJoke, setShowJoke] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [userSubscription, setUserSubscription] = useState<string | null>(null)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const checkUser = async () => {
      try {
        // Obtener el usuario actual usando el nuevo método
        const userEmail = await storage.getCurrentUser();
        
        if (userEmail) {
          setCurrentUser(userEmail);
          
          // Obtener el perfil del usuario para verificar su plan
          const userProfile = await storage.getUserProfile(userEmail);
          
          if (userProfile) {
            setUserSubscription(userProfile.subscription_plan);
          }
        }
      } catch (error) {
        console.error("Error al verificar el usuario:", error);
      }
    };
    
    checkUser();
  }, []);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await storage.logout();
      window.location.href = "/";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 bg-white z-50 transition-shadow duration-200 border-b-2 border-secondary ${
      hasScrolled ? 'shadow-lg' : ''
    }`}>
      {/* Top utility bar */}
      <div className="border-b-2 border-secondary py-8 px-8 flex justify-between items-center text-sm relative">
        <div className="w-[100px] flex items-center">
          <Link 
            href="#" 
            className="text-secondary/70 hover:text-primary transition-colors duration-200 whitespace-nowrap"
            onMouseEnter={() => setShowJoke(true)}
            onMouseLeave={() => setShowJoke(false)}
          >
            {showJoke ? "Just kidding!" : "Got a tip?"}
          </Link>
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link href="/" className="block transition-transform hover:scale-105 duration-200">
            <div className="font-logo text-6xl text-primary transform relative">
              <span className="relative text-stroke-1 text-stroke-white">KOOL</span>
              <div className="absolute inset-0 transform translate-x-0.5 translate-y-0.5 text-black -z-10">KOOL</div>
            </div>
          </Link>
        </div>
        <div className="w-[200px] flex items-center justify-end space-x-4">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={toggleProfileMenu}
                className={`w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-300 ${
                  isProfileMenuOpen ? 'rounded-lg' : 'hover:bg-primary/20'
                }`}
              >
                <User size={20} className="text-primary" />
              </button>
              
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg border border-gray-200 overflow-hidden transform origin-top-right transition-transform duration-200 ease-out">
                  <div className="py-1">
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/signup" className="text-secondary/70 hover:text-primary">
                Sign Up
              </Link>
              <Link href="/auth/login" className="text-secondary/70 hover:text-primary">
                Login
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Main navigation */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-center relative">
        <button className="md:hidden absolute left-4" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className="hidden md:flex items-center space-x-8 font-bold text-sm uppercase">
          {!isHomePage && (
            <Link 
              href="/" 
              className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
            >
              <Home size={16} />
              <span>Home</span>
            </Link>
          )}
          
          {isHomePage && (
            <>
              <Link href="#features" className="hover:text-primary">
                Features
              </Link>
              <Link href="#how-it-works" className="hover:text-primary">
                How It Works
              </Link>
              <Link href="#artists" className="hover:text-primary">
                Artists
              </Link>
              <Link href="#about" className="hover:text-primary">
                About
              </Link>
            </>
          )}
          {currentUser ? (
            <>
              <Link href="/dashboard" className="hover:text-primary">
                Dashboard
              </Link>
              <Link href="/chat" className="hover:text-primary">
                Chat
              </Link>
            </>
          ) : (
            <Link href="#pricing" className="hover:text-primary">
              Pricing
            </Link>
          )}
        </nav>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t-2 border-secondary">
          <nav className="container mx-auto px-4 py-4 flex flex-col items-center space-y-4 font-bold text-sm uppercase">
            {!isHomePage && (
              <Link href="/" className="hover:text-primary py-2 border-b-2 border-secondary flex items-center gap-2">
                <Home size={16} />
                <span>Home</span>
              </Link>
            )}
            
            {isHomePage && (
              <>
                <Link href="#features" className="hover:text-primary py-2 border-b-2 border-secondary">
                  Features
                </Link>
                <Link href="#how-it-works" className="hover:text-primary py-2 border-b-2 border-secondary">
                  How It Works
                </Link>
                <Link href="#artists" className="hover:text-primary py-2 border-b-2 border-secondary">
                  Artists
                </Link>
                <Link href="#about" className="hover:text-primary py-2 border-b-2 border-secondary">
                  About
                </Link>
              </>
            )}
            
            {currentUser ? (
              <>
                <Link href="/dashboard" className="hover:text-primary py-2 border-b-2 border-secondary">
                  Dashboard
                </Link>
                <Link href="/chat" className="hover:text-primary py-2 border-b-2 border-secondary">
                  Chat
                </Link>
              </>
            ) : (
              <>
                <Link href="#pricing" className="hover:text-primary py-2 border-b-2 border-secondary">
                  Pricing
                </Link>
                <Link href="#news" className="hover:text-primary py-2 border-b-2 border-secondary">
                  News
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
