import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function SuccessStories() {
  return (
    <section id="artists" className="mb-12 border-t-2 border-secondary pt-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
        <div>
          <div className="bg-primary text-white inline-block px-3 py-1 text-xs font-bold mb-3">KOOL STORIES</div>
          <h2 className="text-3xl md:text-4xl font-black mb-2">
            ARTISTS TRANSFORMING THEIR CAREERS WITH <span className="text-primary">KOOL</span>
          </h2>
          <p className="text-lg text-secondary/70">
            Meet the independent musicians who are using KOOL to reach new heights
          </p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button variant="outline" size="icon" className="rounded-full border-secondary/20">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full border-secondary/20">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-background overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="aspect-square">
              <img
                src="/placeholder.svg?height=400&width=400"
                alt="Jamie Taylor"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="text-sm font-bold text-primary mb-2">FEATURED ARTIST</div>
              <h3 className="text-2xl font-bold mb-3">Jamie Taylor</h3>
              <p className="text-sm text-secondary/70 mb-4">Electronic Artist • Los Angeles, CA</p>
              <p className="text-secondary/80 mb-4">
                "Within 6 months of using KOOL, my monthly listeners went from 500 to 50,000. The AI manager helped me
                identify my target audience and create a marketing strategy that actually worked."
              </p>
              <div className="text-sm mb-4">
                <span className="font-bold">Results:</span> 10,000% growth in streams, 3 playlist placements, $4,000
                monthly revenue
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-white w-full">Read Full Story</Button>
            </div>
          </div>
        </div>

        <div className="bg-background overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="aspect-square">
              <img
                src="/placeholder.svg?height=400&width=400"
                alt="Sophia Chen"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="text-sm font-bold text-primary mb-2">FEATURED ARTIST</div>
              <h3 className="text-2xl font-bold mb-3">Sophia Chen</h3>
              <p className="text-sm text-secondary/70 mb-4">Indie Pop • New York, NY</p>
              <p className="text-secondary/80 mb-4">
                "KOOL's AI helped me optimize my release strategy and connect with playlist curators I never would have
                found on my own. My latest single got 100,000 streams in the first week."
              </p>
              <div className="text-sm mb-4">
                <span className="font-bold">Results:</span> 200% increase in engagement, 15 playlist placements, signed
                to indie label
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-white w-full">Read Full Story</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border-2 border-secondary p-6">
          <div className="text-sm font-bold text-primary mb-2">QUICK STORY</div>
          <h3 className="text-xl font-bold mb-2">Marcus Johnson</h3>
          <p className="text-sm text-secondary/70 mb-3">Hip-Hop Artist • Atlanta, GA</p>
          <p className="text-secondary/80 text-sm">
            "KOOL found licensing opportunities I never would have discovered. My music is now in commercials and TV
            shows."
          </p>
        </div>

        <div className="border-2 border-secondary p-6">
          <div className="text-sm font-bold text-primary mb-2">QUICK STORY</div>
          <h3 className="text-xl font-bold mb-2">Elena Diaz</h3>
          <p className="text-sm text-secondary/70 mb-3">Latin Pop • Miami, FL</p>
          <p className="text-secondary/80 text-sm">
            "The fan engagement tools helped me build a dedicated community. My concert tickets now sell out in
            minutes."
          </p>
        </div>

        <div className="border-2 border-secondary p-6">
          <div className="text-sm font-bold text-primary mb-2">QUICK STORY</div>
          <h3 className="text-xl font-bold mb-2">Jordan Lee</h3>
          <p className="text-sm text-secondary/70 mb-3">Indie Folk • Portland, OR</p>
          <p className="text-secondary/80 text-sm">
            "KOOL's AI helped me identify my unique sound and audience. I've tripled my income in just 3 months."
          </p>
        </div>
      </div>
    </section>
  )
}
