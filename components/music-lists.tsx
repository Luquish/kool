import { Button } from "@/components/ui/button"

export default function MusicLists() {
  return (
    <section className="my-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <div className="bg-primary text-white inline-block px-3 py-1 text-xs font-bold mb-3">MUSIC LISTS</div>
          <h2 className="text-3xl font-black mb-4">THE TOP 5 AI TOOLS CHANGING MUSIC PRODUCTION</h2>
          <div className="aspect-[4/3] bg-background mb-4">
            <img
              src="/placeholder.svg?height=400&width=600"
              alt="AI Music Production"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-secondary/70 mb-4">
            From automated mastering to AI-generated melodies, these tools are revolutionizing how independent artists
            create music
          </p>
          <div className="text-xs text-secondary/60 mb-4">
            <span className="font-bold">By KOOL EDITORIAL TEAM</span> • May 8, 2025
          </div>
          <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary/5">
            Read Full Article
          </Button>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-secondary text-white p-8">
            <div className="text-primary font-bold text-lg mb-2">THE LISTS</div>
            <h2 className="text-4xl font-black mb-6 text-white">5 WAYS AI IS HELPING INDEPENDENT ARTISTS SUCCEED</h2>
            <div className="space-y-6">
              <div className="border-b border-white/20 pb-4">
                <div className="flex items-start">
                  <span className="text-5xl font-black text-primary mr-4">1</span>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Personalized Marketing Strategies</h3>
                    <p className="text-white/80">
                      KOOL's AI analyzes your audience data to create targeted marketing campaigns that actually convert
                      to streams and sales
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-b border-white/20 pb-4">
                <div className="flex items-start">
                  <span className="text-5xl font-black text-primary mr-4">2</span>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Automated Release Planning</h3>
                    <p className="text-white/80">
                      Strategic scheduling based on industry trends, audience behavior, and platform algorithms
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-b border-white/20 pb-4">
                <div className="flex items-start">
                  <span className="text-5xl font-black text-primary mr-4">3</span>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Royalty Tracking & Optimization</h3>
                    <p className="text-white/80">
                      AI-powered tools that ensure you're getting paid for every stream across all platforms
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-b border-white/20 pb-4">
                <div className="flex items-start">
                  <span className="text-5xl font-black text-primary mr-4">4</span>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Fan Engagement Automation</h3>
                    <p className="text-white/80">
                      Tools that help you maintain meaningful connections with fans without spending hours on social
                      media
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-start">
                  <span className="text-5xl font-black text-primary mr-4">5</span>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Production Enhancement</h3>
                    <p className="text-white/80">
                      AI-assisted mixing, mastering, and arrangement tools that give your music a professional sound
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
