import Link from "next/link"
import Image from "next/image"
import { Headphones, Music, Play, Zap, FileMusicIcon as MusicNote } from "lucide-react"
import { Button } from "@/components/ui/button"
import FeatureCard from "@/components/feature-card"
import PricingCard from "@/components/pricing-card"
import TestimonialCard from "@/components/testimonial-card"
import SiteHeader from "@/components/site-header"
import FloatingNotes from "@/components/floating-notes"

export default function Home() {
  return (
    <div className="min-h-screen bg-cream text-black pt-16">
      <SiteHeader />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-cream pt-10 h-screen">
          <FloatingNotes count={8} />
          <div className="absolute top-20 right-0 w-1/3 h-full bg-orange-500 opacity-10 -skew-x-12 transform"></div>
          <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-navy-blue opacity-10 skew-x-12 transform"></div>
          <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-block px-4 py-1 bg-orange-500 text-white font-bold text-sm uppercase tracking-wider transform -rotate-2">
                  The Future of Music Management
                </div>
                <h1 className="text-6xl md:text-8xl font-extrabold leading-none heading-display text-black">
                  Your Strategy never looked this <span className="text-orange-500">Kool</span>
                </h1>
                <p className="text-xl text-gray-700 max-w-lg">
                  <span className="kool-brand">KOOL</span> is your AI music strategist: gain the insights and tools of a pro manager—no middleman required.<br />
                  <span className="block mt-2 font-semibold text-primary">Your music. Your data. Your strategy.</span>
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-orange-500 hover:bg-orange-600 text-white transform hover:-translate-y-1 transition duration-200"
                  >
                    Create your KOOL profile
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-black text-white hover:bg-black hover:text-white transform hover:-translate-y-1 transition duration-200"
                  >
                    Watch Demo
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -top-16 -right-16 w-32 h-32 bg-mustard rounded-full opacity-20"></div>
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-navy-blue rounded-full opacity-20"></div>

                <div className="relative z-10 flex justify-center">
                  <div className="relative w-full h-auto max-w-md">
                    <div className="absolute inset-0 bg-orange-500 transform rotate-3"></div>
                    <Image
                      src="/images/jazz-trumpet.png"
                      alt="Jazz Musician"
                      width={400}
                      height={500}
                      className="relative z-10 transform -rotate-2"
                    />
                  </div>
                </div>

                <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4">
                  <div className="text-6xl font-bold heading-display text-navy-blue opacity-30 rotate-12">LATIN</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Latin America Section */}
        <section className="py-20 bg-mustard relative">
          <div className="container mx-auto px-4 relative z-10 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="absolute -top-8 -left-8 w-full h-full bg-orange-500 opacity-10 transform -rotate-3"></div>
                <Image
                  src="/images/america-latina.png"
                  alt="América Latina"
                  width={500}
                  height={700}
                  className="relative z-10"
                />
              </div>

              <div className="space-y-8">
                <h2 className="text-5xl md:text-6xl font-bold heading-display text-black">
                  MADE FOR <span className="text-orange-500">LATIN</span> AMERICA
                </h2>
                <p className="text-xl text-gray-800">
                  <span className="kool-brand">KOOL</span> is designed specifically for the vibrant and diverse Latin American music scene. We understand
                  the unique challenges and opportunities for musicians in the region.
                </p>
                <div className="space-y-6">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
                      <MusicNote className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold heading-display">LOCAL MARKET INSIGHTS</h3>
                      <p>Data-driven recommendations for your specific country and genre</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-full bg-navy-blue flex items-center justify-center">
                      <MusicNote className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold heading-display">REGIONAL PROMOTION</h3>
                      <p>Connect with local venues, festivals, and streaming platforms</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
                      <MusicNote className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold heading-display">MULTILINGUAL SUPPORT</h3>
                      <p>Full platform support in Spanish, Portuguese, and English</p>
                    </div>
                  </div>
                </div>

                <Button className="bg-black text-white hover:bg-gray-800">Learn More About Regional Features</Button>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-cream relative h-screen">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="inline-block text-5xl md:text-6xl font-bold pb-2 heading-display">
                Work Smarter. Stay <span className="kool-brand">KOOL</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="space-y-12">
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-16 h-16 bg-orange-500 flex items-center justify-center font-bold text-3xl heading-display text-white">
                    1
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 heading-display">CONNECT YOUR MUSIC</h3>
                    <p className="text-gray-700">
                      Link your existing profiles and upload your music for <span className="kool-brand">KOOL</span> to analyze.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-16 h-16 bg-navy-blue flex items-center justify-center font-bold text-3xl heading-display text-white">
                    2
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 heading-display">GET AI ANALYSIS</h3>
                    <p className="text-gray-700">Our AI analyzes your music style, audience, and market position.</p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-16 h-16 bg-mustard flex items-center justify-center font-bold text-3xl heading-display text-black">
                    3
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 heading-display">RECEIVE STRATEGY</h3>
                    <p className="text-gray-700">
                      Get a personalized growth strategy tailored to your unique sound and goals.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-16 h-16 bg-orange-500 flex items-center justify-center font-bold text-3xl heading-display text-white">
                    4
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 heading-display">EXECUTE & GROW</h3>
                    <p className="text-gray-700">
                      Implement recommendations with our tools and watch your career take off.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -top-8 -left-8 w-full h-full bg-navy-blue opacity-10 transform rotate-3"></div>
                <div className="bg-cream p-8 border-2 border-gray-800 relative z-10">
                  <div className="aspect-video bg-gray-100 mb-6 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 zigzag-pattern text-orange-500 opacity-5"></div>
                    <Play className="w-16 h-16 text-orange-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 heading-display">SEE <span className="kool-brand">KOOL</span> IN ACTION</h3>
                  <p className="text-gray-700 mb-4">
                    Watch how independent artists are using <span className="kool-brand">KOOL</span> to transform their careers.
                  </p>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">Watch Demo</Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Jazz Inspired Section */}
        <section className="py-20 bg-navy-blue text-white relative h-screen">
          <div className="container mx-auto px-4 relative z-10 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-5xl md:text-6xl font-bold heading-display">
                  OUR <span className="text-orange-500">VISION</span>
                </h2>
                <p className="text-xl text-gray-300">
                  Like the great jazz improvisers, <span className="kool-brand">KOOL</span> adapts to your unique style and helps you find your voice in the
                  music industry.
                </p>
                <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
                      <MusicNote className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold heading-display">ACCESSIBILITY</h3>
                      <p className="text-gray-300">It's like having a professional team within reach of any independent artist. No friction, no filters.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-full bg-mustard flex items-center justify-center">
                      <MusicNote className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold heading-display">SUSTAINABILITY</h3>
                      <p className="text-gray-300">Build a real career with concrete tools that support long-term growth.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
                      <MusicNote className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold heading-display">AUTONOMY</h3>
                      <p className="text-gray-300">KOOL works for you. No intermediaries, no dependencies.</p>
                    </div>
                  </div>
                </div>

                <Button className="bg-orange-500 hover:bg-orange-600 text-white">Discover Your Sound</Button>
              </div>

              <div className="relative">
                <div className="absolute -top-8 -right-8 w-full h-full bg-orange-500 opacity-10 transform rotate-3"></div>
                <Image
                  src="/images/jazz-cat-rooms.png"
                  alt="Jazz Musician"
                  width={500}
                  height={700}
                  className="relative z-10"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 relative overflow-hidden bg-cream h-screen">
          <div className="absolute top-0 right-0 w-64 h-64 bg-navy-blue rounded-full opacity-5 transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500 rounded-full opacity-5 transform -translate-x-1/2 translate-y-1/2"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="inline-block text-5xl md:text-6xl font-bold pb-2 heading-display">
                <span className="text-mustard">SUBSCRIPTION</span> PLANS
              </h2>
              <p className="mt-6 text-xl text-gray-700 max-w-2xl mx-auto">
                Choose the plan that fits your career stage. All plans include our AI manager features.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <PricingCard
                title="INDIE ARTIST"
                price="9.99"
                features={[
                  "AI Career Analysis",
                  "Basic Distribution Tools",
                  "Social Media Strategy",
                  "Fan Engagement Tips",
                  "Monthly Strategy Update",
                ]}
                cta="Get Started"
                popular={false}
                color="navy"
              />

              <PricingCard
                title="RISING STAR"
                price="19.99"
                features={[
                  "Everything in Indie Artist",
                  "Advanced Analytics",
                  "Playlist Submission Tools",
                  "PR Strategy Assistant",
                  "Weekly Strategy Updates",
                ]}
                cta="Get Started"
                popular={true}
                color="orange"
              />

              <PricingCard
                title="PRO MUSICIAN"
                price="29.99"
                features={[
                  "Everything in Rising Star",
                  "Team Management Tools",
                  "Revenue Optimization",
                  "Tour Planning Assistant",
                  "Priority Support Access",
                ]}
                cta="Get Started"
                popular={false}
                color="mustard"
              />
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-orange-500 text-white relative">
          <div className="absolute inset-0 circle-pattern text-black opacity-5"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="inline-block text-5xl md:text-6xl font-bold pb-2 heading-display">
                ARTIST <span className="text-navy-blue">STORIES</span>
              </h2>
              <p className="mt-6 text-xl text-white max-w-2xl mx-auto">
                Hear from independent musicians who have transformed their careers with <span className="kool-brand">KOOL</span>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TestimonialCard
                quote="KOOL helped me double my streaming numbers in just 3 months with personalized promotion strategies."
                name="CARLOS RODRIGUEZ"
                title="Indie Rock Artist"
                location="Mexico City"
                color="navy"
                bgColor="white"
                textColor="black"
              />

              <TestimonialCard
                quote="The AI manager gave me insights about my audience I never would have discovered on my own."
                name="MARIA GONZALEZ"
                title="Singer-Songwriter"
                location="Buenos Aires"
                color="mustard"
                bgColor="white"
                textColor="black"
              />

              <TestimonialCard
                quote="As an independent artist, I couldn't afford a manager. KOOL gives me professional guidance at a fraction of the cost."
                name="JUAN PEREZ"
                title="Hip-Hop Producer"
                location="Bogotá"
                color="orange"
                bgColor="white"
                textColor="black"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden bg-cream">
          <div className="absolute inset-0 dot-pattern text-orange-500 opacity-5"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block px-4 py-1 bg-orange-500 text-white font-bold text-sm uppercase tracking-wider transform -rotate-2 mb-6">
                Ready to Transform Your Music Career?
              </div>
              <h2 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight heading-display">
                Join the <span className="kool-brand">KOOL</span>ture
              </h2>
              <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
                Start your 14-day free trial today and see how <span className="kool-brand">KOOL</span>'s AI-powered management can take your music to the
                next level.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white transform hover:-translate-y-1 transition duration-200"
                >
                  Create your KOOL profile
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-black text-white hover:bg-black hover:text-white transform hover:-translate-y-1 transition duration-200"
                >
                  Schedule Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-gray-300 bg-cream">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <span className="kool-brand text-3xl">KOOL</span>
              </div>
              <div className="flex flex-wrap gap-8 justify-center">
                <Link href="#" className="text-gray-600 hover:text-orange-500 transition">
                  Features
                </Link>
                <Link href="#" className="text-gray-600 hover:text-orange-500 transition">
                  Pricing
                </Link>
                <Link href="#" className="text-gray-600 hover:text-orange-500 transition">
                  Testimonials
                </Link>
                <Link href="#" className="text-gray-600 hover:text-orange-500 transition">
                  Blog
                </Link>
                <Link href="#" className="text-gray-600 hover:text-orange-500 transition">
                  Contact
                </Link>
              </div>
              <div className="mt-6 md:mt-0">
                <p className="text-gray-600">© 2025 <span className="kool-brand">KOOL</span>. All rights reserved.</p>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
