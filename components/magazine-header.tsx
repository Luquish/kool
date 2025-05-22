"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Menu, X, User, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import storage from "@/lib/storage"
import { usePathname } from "next/navigation"
import CreditModal from "@/components/credit-modal"
import { toast } from "@/components/ui/use-toast"

export default function MagazineHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showJoke, setShowJoke] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [userSubscription, setUserSubscription] = useState<string | null>(null)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false)
  const [userCredits, setUserCredits] = useState<number | null>(null)
  const pathname = usePathname()
  const isHomePage = pathname === "/"
  const shouldHideNavigation = ['/chat', '/dashboard', '/profile'].includes(pathname)

  // Función para obtener los créditos actuales
  const fetchCurrentCredits = async (userEmail: string) => {
    try {
      const response = await fetch('/api/credits');
      if (response.ok) {
        const data = await response.json();
        if (typeof data.credits === 'number') {
          setUserCredits(data.credits);
        }
      }
    } catch (error) {
      console.error("Error al obtener créditos:", error);
    }
  };

  // Efecto para manejar el scroll
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Efecto para escuchar actualizaciones de créditos
  useEffect(() => {
    const handleCreditsUpdate = (event: CustomEvent<{ credits: number }>) => {
      setUserCredits(event.detail.credits);
    };

    window.addEventListener('updateCredits', handleCreditsUpdate as EventListener);

    return () => {
      window.removeEventListener('updateCredits', handleCreditsUpdate as EventListener);
    };
  }, []);

  // Efecto para cargar datos del usuario y refrescar créditos periódicamente
  useEffect(() => {
    const checkUser = async () => {
      try {
        const userEmail = await storage.getCurrentUser();
        
        if (userEmail) {
          setCurrentUser(userEmail);
          
          const userProfile = await storage.getUserProfile(userEmail);
          if (userProfile) {
            setUserSubscription(userProfile.subscription_plan);
          }

          // Obtener créditos actuales
          await fetchCurrentCredits(userEmail);
        }
      } catch (error) {
        console.error("Error al cargar datos del usuario:", error);
      }
    };
    
    checkUser();

    // Refrescar créditos cada 30 segundos si hay un usuario activo
    let interval: NodeJS.Timeout;
    if (currentUser) {
      interval = setInterval(() => {
        fetchCurrentCredits(currentUser);
      }, 30000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [currentUser]);

  const refreshCredits = async () => {
    if (currentUser) {
      await fetchCurrentCredits(currentUser);
    }
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      const success = await storage.logout();
      if (success) {
        setCurrentUser(null);
        setUserCredits(null);
        setUserSubscription(null);
        setIsProfileMenuOpen(false);
        window.location.href = "/";
      } else {
        throw new Error("Error al cerrar sesión");
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast({
        title: "Error",
        description: "No se pudo cerrar sesión. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 bg-white z-50 transition-all duration-300 ease-in-out border-b-2 border-secondary ${
      hasScrolled ? 'shadow-lg' : ''
    } ${shouldHideNavigation ? 'shadow-[0_20px_40px_-2px_hsl(0_73%_37%_/_0.5)] pb-0' : 'pb-0'}`}>
      {/* Top utility bar */}
      <div className="border-b-2 border-secondary py-8 px-8 flex justify-between items-center text-sm relative">
        <div className="w-[100px] flex items-center">
          <Link 
            href="#" 
            className="text-secondary/70 hover:text-primary trsansition-colors duration-200 whitespace-nowrap"
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
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm text-gray-600">Kool Credits</p>
                      <p className="text-lg font-bold text-primary">{userCredits} credits</p>
                    </div>
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      My Profile
                    </Link>
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Dashboard
                    </Link>
                    <button
                      onClick={() => setIsCreditModalOpen(true)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Add Kool Credits
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
              <CreditModal
                isOpen={isCreditModalOpen}
                onClose={() => setIsCreditModalOpen(false)}
                onSuccess={refreshCredits}
              />
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
      {!shouldHideNavigation && (
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
                <Link href="#how-it-works" className="hover:text-primary">
                  How It Works
                </Link>
                
                <Link href="#services" className="hover:text-primary">
                  Services
                </Link>
                <Link href="#about" className="hover:text-primary">
                  About
                </Link>
                <Link href="#artists" className="hover:text-primary">
                  Artists
                </Link>
                <Link href="/chat" className="hover:text-primary">
                  Chat
                </Link>
              </>
            )}
          </nav>
        </div>
      )}

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
                <Link href="/chat" className="hover:text-primary py-2 border-b-2 border-secondary">
                  Chat
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
