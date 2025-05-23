import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mb-12 border-t-2 border-secondary pt-12">
      <div className="grid grid-cols-1 gap-8">
        <div className="flex flex-col justify-between">
        <div className="bg-secondary text-white p-8 mb-8">
          <div className="text-primary font-bold text-lg mb-2">STEPS</div>
          <h2 className="text-4xl font-black mb-6 text-white">YOUR PATH TO SUCCESS WITH KOOL</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-b md:border-b-0 md:border-r border-white/20 pb-4 md:pb-0 md:pr-4">
              <div className="flex items-center">
                <span className="text-5xl font-black text-primary mr-4 w-12 text-center">1</span>
                <div>
                  <h3 className="text-xl font-bold">Define Your Goals</h3>
                </div>
              </div>
            </div>

            <div className="border-b md:border-b-0 md:border-r border-white/20 pb-4 md:pb-0 md:pr-4">
              <div className="flex items-center">
                <span className="text-5xl font-black text-primary mr-4 w-12 text-center">2</span>
                <div>
                  <h3 className="text-xl font-bold">Execute with AI</h3>
                </div>
              </div>
            </div>

            <div className="pb-4 md:pb-0">
              <div className="flex items-center">
                <span className="text-5xl font-black text-primary mr-4 w-12 text-center">3</span>
                <div>
                  <h3 className="text-xl font-bold">Track your results</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
          <div>
            <div className="bg-primary text-white inline-block px-3 py-1 text-xs font-bold mb-3">THE KOOL WAY</div>
            <h2 className="text-3xl font-black mb-4">This is what being <span className="text-primary">Kool</span> looks like.</h2>
            <div className="bg-background mb-4 w-full mx-auto">
              <img
                src="/images/thekoolway.png"
                alt="KOOL Process"
                className="w-full h-auto object-contain"
              />
            </div>
            <p className="text-secondary/70 mb-4">
              Discover how KOOL's AI-powered platform transforms your music career with automated management and strategic growth.
            </p>
            <div className="text-xs text-secondary/60 mb-4">
              <span className="font-bold">By KOOL TEAM</span> • May 8, 2025
            </div>
          </div>
          <Link href="/chat" className="inline-block">
            <Button variant="outline" className="border-secondary bg-primary text-white hover:bg-primary/90 w-full">
              See it in Action
            </Button>
          </Link>
        </div>

        
      </div>
    </section>
  )
}
