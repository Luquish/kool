import { Button } from "@/components/ui/button"

export default function HeroArticle() {
  return (
    <section className="my-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:grid-rows-1">
        {/* Main feature - made to fill the full height */}
        <div className="lg:col-span-8 relative h-full flex flex-col">
          <div className="absolute top-0 left-0 bg-primary text-white px-4 py-1 text-sm font-bold z-10">
            EXCLUSIVE
          </div>
          <div className="relative flex-1 overflow-hidden">
            <img
              src="/images/KOOL.png"
              alt="AI Music Revolution"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h2 className="text-4xl md:text-6xl font-black leading-tight mb-4">
                STRATEGY NEVER LOOKED THIS KOOL
              </h2>
              <p className="text-xl md:text-2xl font-medium mb-6 max-w-3xl">
              Kool is your AI-powered strategist — built to grow your project. We give you the insights and tools a pro manager would — without the middleman. Your music. Your vision. Your strategy.

              </p>
              <div className="flex items-center text-white/80 text-sm mb-4">
                <span className="font-bold mr-2">By Juan Obstrovsky</span>
                <span>May 19, 2025</span>
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-white">Read More</Button>
            </div>
          </div>
        </div>

        {/* Side articles */}
        <div className="lg:col-span-4 flex flex-col space-y-6 h-full">
          <div className="border-b border-secondary pb-6">
            <div className="bg-secondary text-white inline-block px-3 py-1 text-xs font-bold mb-3">THE FUTURE</div>
            <h3 className="text-2xl font-bold mb-2">How AI Is Changing The Way Artists Create Music</h3>
            <p className="text-secondary/70 mb-2">
              We believe that every artist deserves the chance to grow, connect and monetize — regardless of time, money or access. KOOL was built to remove the friction that stops most emerging talents from going pro
            </p>
            <div className="text-xs text-secondary/60">
              <span className="font-bold">By Guadalupe Cardiello</span> • May 15, 2025
            </div>
          </div>

          <div className="border-b border-secondary pb-6">
            <div className="bg-primary text-white inline-block px-3 py-1 text-xs font-bold mb-3">SUCCESS STORY</div>
            <h3 className="text-2xl font-bold mb-2">"I Went From 100 to 100,000 Monthly Listeners"</h3>
            <p className="text-secondary/70 mb-2">
              Indie artist Jamie Taylor shares how KOOL's AI manager transformed his career in just 6 months
            </p>
            <div className="text-xs text-secondary/60">
              <span className="font-bold">By Francisco Morchio</span> • May 12, 2025
            </div>
          </div>

          <div>
            <div className="bg-secondary text-white inline-block px-3 py-1 text-xs font-bold mb-3">NEW RELEASE</div>
            <h3 className="text-2xl font-bold mb-2">KOOL Launches Advanced Task Tracking Feature</h3>
            <p className="text-secondary/70 mb-2">
              New AI-powered tool helps artists track and maximize their streaming across all platforms
            </p>
            <div className="text-xs text-secondary/60">
              <span className="font-bold">By Faustina Bagnat</span> • May 10, 2025
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
