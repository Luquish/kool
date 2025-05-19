import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Alex Rivera",
      role: "Indie Pop Artist",
      image: "/placeholder.svg?height=100&width=100",
      quote:
        "Since using KOOL, my streaming numbers have increased by 300% and I've booked twice as many shows. The AI recommendations are spot-on.",
    },
    {
      name: "Sophia Chen",
      role: "Electronic Producer",
      image: "/placeholder.svg?height=100&width=100",
      quote:
        "KOOL helped me identify my core audience and create a marketing strategy that actually works. It's like having a manager who knows the industry inside out.",
    },
    {
      name: "Marcus Johnson",
      role: "Hip-Hop Artist",
      image: "/placeholder.svg?height=100&width=100",
      quote:
        "The revenue optimization feature alone paid for my subscription in the first month. KOOL found licensing opportunities I never would have discovered.",
    },
  ]

  return (
    <section id="testimonials" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-secondary mb-4 font-display">Artist Success Stories</h2>
            <p className="text-lg text-secondary/70 max-w-2xl">
              See how independent musicians are transforming their careers with KOOL's AI-powered management.
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-lg border-2 border-secondary shadow-sm">
              <div className="flex items-center mb-6">
                <div className="mr-4">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-secondary font-display">{testimonial.name}</h3>
                  <p className="text-secondary/70">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-secondary/80 italic">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>

        {/* Magazine-style featured artist */}
        <div className="mt-16 bg-secondary text-white rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 md:p-12">
              <div className="text-sm font-bold text-primary mb-2 font-display">FEATURED ARTIST</div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 font-display">From Bedroom Producer to Festival Headliner</h3>
              <p className="text-white/80 mb-6">
                "KOOL's AI manager helped me navigate the industry, connect with the right people, and build a
                sustainable career. Within 18 months, I went from releasing tracks on SoundCloud to performing at major
                festivals."
              </p>
              <div className="flex items-center">
                <img
                  src="/placeholder.svg?height=60&width=60"
                  alt="Jamie Taylor"
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <div className="font-bold font-display">Jamie Taylor</div>
                  <div className="text-white/70 text-sm">Electronic Artist</div>
                </div>
              </div>
            </div>
            <div className="bg-primary/20 relative min-h-[300px]">
              <img
                src="/placeholder.svg?height=600&width=800"
                alt="Jamie Taylor performing"
                className="w-full h-full object-cover absolute inset-0 mix-blend-overlay opacity-60"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
