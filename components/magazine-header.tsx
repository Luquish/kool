"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Menu, X, User } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { usePathname } from "next/navigation"
import CreditModal from "@/components/credit-modal"
import { toast } from "@/components/ui/use-toast"
import { OnboardingModal } from "@/components/ui/onboarding-modal"
import { useAuth } from "@/components/providers/auth-provider"

export default function MagazineHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showJoke, setShowJoke] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false)
  const [showOnboardingAlert, setShowOnboardingAlert] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const isHomePage = pathname === "/"
  const isTutorialsPage = pathname === "/tutorials"
  const { user: currentUser, profile: userProfile, credits: userCredits, strategy: userStrategy, isLoading, isInitializing } = useAuth()

  // Debug logs
  useEffect(() => {
    console.log('MagazineHeader - Estado actual:', {
      currentUser: currentUser?.id,
      userProfile: userProfile?.onboarding_completed,
      userCredits,
      hasStrategy: !!userStrategy,
      isLoading,
      isInitializing
    })
  }, [currentUser, userProfile, userCredits, userStrategy, isLoading, isInitializing])

  // Efecto para manejar el scroll
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setIsProfileMenuOpen(false);
      window.location.href = "/";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast({
        title: "Error",
        description: "No se pudo cerrar sesión. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  // Effect to handle clicking outside of profile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleNavigation = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    
    // Si el usuario no está autenticado, redirigir a login
    if (!currentUser) {
      window.location.href = "/auth/login";
      return;
    }

    // Si estamos cargando o inicializando, no hacer nada
    if (isLoading || isInitializing) {
      console.log('🔄 [Header] Esperando carga de datos...');
      return;
    }

    // Si el usuario no ha completado el onboarding y no estamos en el dashboard
    if (!userProfile?.onboarding_completed && path !== '/dashboard') {
      console.log('👤 [Header] Usuario sin onboarding - Estado:', userProfile);
      setShowOnboardingAlert(true);
      return;
    }

    // Si es la página de dashboard, permitir acceso directo
    if (path === '/dashboard') {
      window.location.href = path;
      return;
    }

    // Para otras páginas protegidas, verificar si tiene estrategia
    if (!userStrategy && ['/profile', '/chat'].includes(path)) {
      toast({
        title: "Estrategia requerida",
        description: "Primero debes crear tu estrategia en el dashboard.",
        variant: "destructive",
      });
      window.location.href = '/dashboard';
      return;
    }

    window.location.href = path;
  };

  // Add effect to handle body scroll
  useEffect(() => {
    if (showOnboardingAlert) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showOnboardingAlert]);

  const renderAuthSection = () => {
    if (isInitializing || isLoading) {
      return (
        <div className="flex items-center space-x-2">
          <div className="w-16 h-8 bg-primary/10 animate-pulse rounded"></div>
          <div className="w-8 h-8 rounded-full bg-primary/10 animate-pulse"></div>
        </div>
      );
    }

    if (!currentUser) {
      return (
        <div className="flex space-x-4">
          <Link href="/auth/signup" className="text-secondary/70 hover:text-primary transition-colors duration-200">
            Sign Up
          </Link>
          <Link href="/auth/login" className="text-secondary/70 hover:text-primary transition-colors duration-200">
            Login
          </Link>
        </div>
      );
    }

    return (
      <div className="relative flex items-center space-x-3" ref={profileMenuRef}>
        <div className="text-primary font-bold block transition-opacity duration-200">
          {userCredits !== null ? `${userCredits} credits` : (
            <div className="w-16 h-4 bg-primary/10 animate-pulse rounded"></div>
          )}
        </div>
        <button
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-300 hover:bg-primary/20"
        >
          <User size={18} className="text-primary" />
        </button>
        {isProfileMenuOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 rounded-lg bg-white shadow-lg border border-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
            <div className="px-4 py-2 text-sm text-gray-500 border-b">
              {userProfile?.email}
            </div>
            <button
              onClick={() => {
                setIsProfileMenuOpen(false);
                handleLogout();
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              Sign Out
            </button>
          </div>
        )}
        <CreditModal
          isOpen={isCreditModalOpen}
          onClose={() => setIsCreditModalOpen(false)}
          onSuccess={() => {}}
        />
      </div>
    );
  };

  return (
    <>
      {showOnboardingAlert && (
        <OnboardingModal isOpen={true} onClose={() => setShowOnboardingAlert(false)} />
      )}
      <header className={`fixed top-0 left-0 right-0 bg-white z-50 transition-all duration-300 ease-in-out border-b-2 border-secondary ${
        hasScrolled ? 'shadow-lg' : ''
      } pb-0`}>
        {/* Top utility bar */}
        <div className="border-b-2 border-secondary py-4 md:py-8 px-4 md:px-8 flex justify-between items-center text-sm relative h-[72px] md:h-[100px]">
          <div className="w-[100px] hidden md:flex items-center">
            <Link 
              href="#" 
              className="text-secondary/70 hover:text-primary transition-colors duration-200 whitespace-nowrap"
              onMouseEnter={() => setShowJoke(true)}
              onMouseLeave={() => setShowJoke(false)}
            >
              {showJoke ? "Just kidding!" : "Got a tip?"}
            </Link>
          </div>
          
          {/* Mobile menu button - left side */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} className="text-primary" /> : <Menu size={24} className="text-primary" />}
            </button>
          </div>

          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className="block transition-transform hover:scale-105 duration-200">
              <div className="font-logo text-4xl md:text-6xl text-primary transform relative">
                <span className="relative text-stroke-1 text-stroke-white">KOOL</span>
                <div className="absolute inset-0 transform translate-x-0.5 translate-y-0.5 text-black -z-10">KOOL</div>
              </div>
            </Link>
          </div>

          <div className="w-[100px] md:w-[200px] flex items-center justify-end space-x-4 min-h-[40px]">
            {renderAuthSection()}
          </div>
        </div>

        {/* Main navigation */}
        <div className="container mx-auto px-4 py-3 flex items-center justify-center relative">
          <nav className={`hidden md:flex items-center space-x-8 font-bold text-sm uppercase transition-opacity duration-300 ${isInitializing ? 'opacity-50' : 'opacity-100'}`}>
            {(isHomePage || isTutorialsPage) && (
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

                <Link href="/tutorials" className="hover:text-primary">
                  Tutorials
                </Link>

                <div className="h-6 w-px bg-secondary mx-4" />
              </>
            )}
            
            <div className="flex items-center space-x-8">
              <Link href="/chat" className="hover:text-primary">
                Chat
              </Link>
              {currentUser && (
                <>
                  <a 
                    href="/profile" 
                    className="hover:text-primary"
                    onClick={(e) => handleNavigation(e, '/profile')}
                  >
                    My Profile
                  </a>
                  <a 
                    href="/dashboard" 
                    className="hover:text-primary"
                    onClick={(e) => handleNavigation(e, '/dashboard')}
                  >
                    Dashboard
                  </a>
                  <button
                    onClick={() => setIsCreditModalOpen(true)}
                    className="hover:text-primary uppercase font-bold text-sm"
                  >
                    Add Kool Credits
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t-2 border-secondary">
            <nav className="container mx-auto px-4 py-4 flex flex-col items-center space-y-4 font-bold text-sm uppercase">          
              {!currentUser && (
                <>
                  <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)} className="hover:text-primary py-2 border-b-2 border-secondary w-full text-center text-primary">
                    Sign Up
                  </Link>
                  <Link href="/auth/login" onClick={() => setIsMenuOpen(false)} className="hover:text-primary py-2 border-b-2 border-secondary w-full text-center text-primary">
                    Login
                  </Link>
                </>
              )}
              {(isHomePage || isTutorialsPage) && (
                <>
                  <Link href="#how-it-works" onClick={() => setIsMenuOpen(false)} className="hover:text-primary py-2 border-b-2 border-secondary w-full text-center">
                    How It Works
                  </Link>
                  <Link href="#services" onClick={() => setIsMenuOpen(false)} className="hover:text-primary py-2 border-b-2 border-secondary w-full text-center">
                    Services
                  </Link>
                  <Link href="#about" onClick={() => setIsMenuOpen(false)} className="hover:text-primary py-2 border-b-2 border-secondary w-full text-center">
                    About
                  </Link>
                  <Link href="#artists" onClick={() => setIsMenuOpen(false)} className="hover:text-primary py-2 border-b-2 border-secondary w-full text-center">
                    Artists
                  </Link>

                  <Link href="/tutorials" onClick={() => setIsMenuOpen(false)} className="hover:text-primary py-2 border-b-2 border-secondary w-full text-center">
                    Tutorials
                  </Link>

                  <div className="w-full border-t-2 border-secondary my-4" />

                  <Link href="/chat" onClick={() => setIsMenuOpen(false)} className="hover:text-primary py-2 border-b-2 border-secondary w-full text-center">
                    Chat
                  </Link>

                  {currentUser && (
                    <>
                      <a 
                        href="/profile" 
                        onClick={(e) => {
                          setIsMenuOpen(false);
                          handleNavigation(e, '/profile');
                        }}
                        className="hover:text-primary py-2 border-b-2 border-secondary w-full text-center"
                      >
                        My Profile
                      </a>
                      <a 
                        href="/dashboard" 
                        onClick={(e) => {
                          setIsMenuOpen(false);
                          handleNavigation(e, '/dashboard');
                        }}
                        className="hover:text-primary py-2 border-b-2 border-secondary w-full text-center"
                      >
                        Dashboard
                      </a>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsCreditModalOpen(true);
                        }}
                        className="hover:text-primary py-2 border-b-2 border-secondary w-full text-center"
                      >
                        Add Kool Credits
                      </button>
                    </>
                  )}
                </>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
