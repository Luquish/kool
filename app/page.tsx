"use client"

import { useState, useEffect } from "react"
import MagazineHeader from "@/components/magazine-header"
import HeroArticle from "@/components/hero-article"
import FeaturedGrid from "@/components/featured-grid"
import SuccessStories from "@/components/success-stories"
import AboutUs from "@/components/about-us"
import PricingSection from "@/components/pricing-section"
import MagazineFooter from "@/components/magazine-footer"
import HowItWorks from "@/components/how-it-works"
import storage from "@/lib/storage"

export default function Home() {
  const [showPricing, setShowPricing] = useState(true)

  useEffect(() => {
    const checkUserSubscription = async () => {
      try {
        // Obtener el usuario actual
        const userEmail = await storage.getCurrentUser();
        
        if (userEmail) {
          // Obtener el perfil del usuario
          const userProfile = await storage.getUserProfile(userEmail);
          
          if (userProfile) {
            // Si tiene un plan de suscripción, no mostrar el componente de precios
            setShowPricing(!userProfile.subscription_plan);
          }
        }
      } catch (error) {
        console.error("Error al verificar la suscripción:", error);
      }
    };
    
    checkUserSubscription();
  }, []);

  return (
    <div className="min-h-screen bg-white [--scroll-padding:120px] [scroll-padding-top:var(--scroll-padding)]">
      <MagazineHeader />
      <main className="container mx-auto px-4 pt-10 pb-16">
        <HeroArticle />
        <FeaturedGrid />
        <HowItWorks />
        <SuccessStories />
        <AboutUs />
        {showPricing && <PricingSection />}
      </main>
      <MagazineFooter />
    </div>
  )
}
