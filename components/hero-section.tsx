import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 md:space-y-8">
            <div className="inline-block bg-primary text-white px-4 py-1 text-sm font-bold rounded-full font-display">
              ISSUE 001 • MAY 2025
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-secondary leading-tight font-display">
              Your AI Music Manager Has Arrived
            </h1>
            <p className="text-lg md:text-xl text-secondary/80 max-w-lg">
              KOOL is the AI-powered platform that helps independent musicians create, promote, and monetize their music
              like never before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-primary hover:bg-primary/90 text-white text-lg px-8 py-6">
                Start Free Trial
              </Button>
              <Button
                variant="outline"
                className="border-secondary text-secondary hover:bg-secondary/5 text-lg px-8 py-6"
              >
                See How It Works
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[3/4] bg-secondary rounded-lg overflow-hidden shadow-2xl transform rotate-1 relative z-10">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-secondary/70"></div>
              <img
                src="/placeholder.svg?height=800&width=600"
                alt="KOOL Magazine Cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="text-sm font-bold mb-2 font-display">FEATURED ARTIST</div>
                <h3 className="text-2xl font-bold mb-1 font-display">How AI Helped Launch an Indie Career</h3>
                <p className="text-white/80">The story of success with KOOL's AI manager</p>
              </div>
            </div>
            <div className="absolute top-8 -right-4 bg-primary text-white py-2 px-4 font-bold transform rotate-12 z-20">
              NEW!
            </div>
          </div>
        </div>
      </div>

      {/* Magazine-style stats bar */}
      <div className="mt-16 py-6 bg-secondary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold font-display">10,000+</div>
              <div className="text-white/70">Artists</div>
            </div>
            <div>
              <div className="text-3xl font-bold font-display">250%</div>
              <div className="text-white/70">Avg. Growth</div>
            </div>
            <div>
              <div className="text-3xl font-bold font-display">$1.2M</div>
              <div className="text-white/70">Artist Earnings</div>
            </div>
            <div>
              <div className="text-3xl font-bold font-display">24/7</div>
              <div className="text-white/70">AI Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
