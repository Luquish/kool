import { Button } from "@/components/ui/button"

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mb-12 border-t-2 border-secondary pt-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <div className="bg-primary text-white inline-block px-3 py-1 text-xs font-bold mb-3">THE KOOL WAY</div>
          <h2 className="text-3xl font-black mb-4">This is what being <span className="text-primary">Kool</span> looks like.</h2>
          <div className="bg-background mb-4">
            <img
              src="/images/thekoolway.png"
              alt="KOOL Process"
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-secondary/70 mb-4">
            Discover how KOOL's AI-powered platform transforms your music career with automated management and strategic growth.
          </p>
          <div className="text-xs text-secondary/60 mb-4">
            <span className="font-bold">By KOOL TEAM</span> • May 8, 2025
          </div>
          <Button variant="outline" className="border-secondary bg-primary text-white hover:bg-primary/5">
            See it in Action
          </Button>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-secondary text-white p-8">
            <div className="text-primary font-bold text-lg mb-2">STEPS</div>
            <h2 className="text-4xl font-black mb-6 text-white">YOUR PATH TO SUCCESS WITH KOOL</h2>
            <div className="space-y-6">
              <div className="border-b border-white/20 pb-4">
                <div className="flex items-start">
                  <span className="text-5xl font-black text-primary mr-4">1</span>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Define Your Goals</h3>
                    <p className="text-white/80">
                      Define your goals, upload your content, and let KOOL analyze your career to generate a custom roadmap.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-b border-white/20 pb-4">
                <div className="flex items-start">
                  <span className="text-5xl font-black text-primary mr-4">2</span>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Execute with AI</h3>
                    <p className="text-white/80">
                      KOOL doesn't just advise — it takes action. From pitching to scheduling and outreach, your AI agent works for you. Just like a manager, but 100% autonomous and scalable.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-b border-white/20 pb-4">
                <div className="flex items-start">
                  <span className="text-5xl font-black text-primary mr-4">3</span>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Optimize Your Content</h3>
                    <p className="text-white/80">
                      Let KOOL's AI analyze your music and content to suggest improvements, optimal release times, and platform-specific strategies for maximum impact.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-b border-white/20 pb-4">
                <div className="flex items-start">
                  <span className="text-5xl font-black text-primary mr-4">4</span>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Track your results</h3>
                    <p className="text-white/80">
                      Visualize your growth with real-time reports and strategic feedback loops in your personalized dashboard. Adjust your path as you grow.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-start">
                  <span className="text-5xl font-black text-primary mr-4">5</span>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Scale Your Success</h3>
                    <p className="text-white/80">
                      As your audience grows, KOOL's AI automatically adapts your strategy, scaling your reach while maintaining authentic connections with your fanbase.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
