"use client"

import MagazineHeader from "@/components/magazine-header"
import HeroArticle from "@/components/hero-article"
import SuccessStories from "@/components/success-stories"
import AboutUs from "@/components/about-us"
import HowItWorks from "@/components/how-it-works"
import MagazineFooter from "@/components/magazine-footer"
import PricingSection from "@/components/pricing-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-white [--scroll-padding:120px] [scroll-padding-top:var(--scroll-padding)]">
      <MagazineHeader />
      <HeroArticle />
      <main className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-40 xl:px-60 2xl:px-96 pt-10 pb-16">
        <HowItWorks />
        <PricingSection />
        <AboutUs />
        <SuccessStories />
      </main>
      <MagazineFooter />
    </div>
  )
}
