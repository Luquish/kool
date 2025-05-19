export default function LatestNews() {
  return (
    <section id="news" className="my-12 border-t-2 border-secondary pt-12">
      <div className="mb-8">
        <div className="bg-secondary text-white inline-block px-3 py-1 text-xs font-bold mb-3">LATEST NEWS</div>
        <h2 className="text-3xl md:text-4xl font-black mb-2">MUSIC INDUSTRY UPDATES</h2>
        <p className="text-lg text-secondary/70 max-w-2xl">
          Stay informed with the latest trends, technologies, and opportunities in the music business
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="aspect-video bg-background mb-4">
            <img
              src="/placeholder.svg?height=300&width=500"
              alt="Streaming platforms"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="bg-primary text-white inline-block px-3 py-1 text-xs font-bold mb-2">STREAMING</div>
          <h3 className="text-xl font-bold mb-2">Streaming Platforms Increase Royalty Rates for Independent Artists</h3>
          <p className="text-secondary/70 text-sm mb-2">
            Major streaming services announce new payment models that benefit smaller artists
          </p>
          <div className="text-xs text-secondary/60">
            <span className="font-bold">By DAVID CHEN</span> • May 5, 2025
          </div>
        </div>

        <div>
          <div className="aspect-video bg-background mb-4">
            <img
              src="/placeholder.svg?height=300&width=500"
              alt="AI music production"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="bg-secondary text-white inline-block px-3 py-1 text-xs font-bold mb-2">TECHNOLOGY</div>
          <h3 className="text-xl font-bold mb-2">New AI Tools Are Changing How Artists Create and Distribute Music</h3>
          <p className="text-secondary/70 text-sm mb-2">
            KOOL's latest features help independent musicians compete with major label artists
          </p>
          <div className="text-xs text-secondary/60">
            <span className="font-bold">By SARAH MILLER</span> • May 3, 2025
          </div>
        </div>

        <div>
          <div className="aspect-video bg-background mb-4">
            <img
              src="/placeholder.svg?height=300&width=500"
              alt="Music festival"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="bg-primary text-white inline-block px-3 py-1 text-xs font-bold mb-2">LIVE MUSIC</div>
          <h3 className="text-xl font-bold mb-2">
            Independent Artists Dominate Festival Lineups Thanks to AI-Powered Growth
          </h3>
          <p className="text-secondary/70 text-sm mb-2">
            KOOL-managed artists secure prime slots at major music festivals worldwide
          </p>
          <div className="text-xs text-secondary/60">
            <span className="font-bold">By MICHAEL TORRES</span> • April 28, 2025
          </div>
        </div>
      </div>

      <div className="mt-12 bg-secondary text-white p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <div className="text-primary font-bold mb-2">HOT TAKE</div>
            <h3 className="text-2xl md:text-3xl font-bold">
              "AI Isn't Replacing Music Managers, It's Making Them Obsolete For Most Independent Artists"
            </h3>
          </div>
          <div className="mt-4 md:mt-0 md:ml-8 text-white/80">
            <p className="italic mb-2">
              "For 90% of independent artists, an AI manager like KOOL can do everything a human manager can—and more—at
              a fraction of the cost."
            </p>
            <p className="text-sm">
              <span className="font-bold">By JAMES WILSON</span> • Music Industry Analyst
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
