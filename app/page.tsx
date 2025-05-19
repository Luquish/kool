import MagazineHeader from "@/components/magazine-header"
import HeroArticle from "@/components/hero-article"
import FeaturedGrid from "@/components/featured-grid"
import SuccessStories from "@/components/success-stories"
import LatestNews from "@/components/latest-news"
import PricingSection from "@/components/pricing-section"
import MagazineFooter from "@/components/magazine-footer"
import HowItWorks from "@/components/how-it-works"

export default function Home() {
  return (
    <div className="min-h-screen bg-white [--scroll-padding:120px] [scroll-padding-top:var(--scroll-padding)]">
      <MagazineHeader />
      <main className="container mx-auto px-4 pt-48 pb-16">
        <HeroArticle />
        <FeaturedGrid />
        <HowItWorks />
        <SuccessStories />
        <LatestNews />
        <PricingSection />
      </main>
      <MagazineFooter />
    </div>
  )
}
