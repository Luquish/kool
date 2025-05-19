import { Mic, TrendingUp, DollarSign, Calendar, Users, BarChart } from "lucide-react"

export default function FeaturedGrid() {
  const features = [
    {
      icon: <Mic className="h-8 w-8 text-primary" />,
      title: "AI Production Assistant",
      description: "Get real-time feedback on your tracks and suggestions to improve your sound.",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: "Growth Strategy",
      description: "Custom marketing plans based on your genre, audience, and career goals.",
    },
    {
      icon: <DollarSign className="h-8 w-8 text-primary" />,
      title: "Revenue Optimization",
      description: "Maximize your earnings across streaming, licensing, and merchandise.",
    },
    {
      icon: <Calendar className="h-8 w-8 text-primary" />,
      title: "Release Planning",
      description: "Strategic scheduling for maximum impact and audience growth.",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Fan Engagement",
      description: "AI-powered tools to build and nurture your fan community.",
    },
    {
      icon: <BarChart className="h-8 w-8 text-primary" />,
      title: "Performance Analytics",
      description: "Comprehensive insights into your music's performance and audience.",
    },
  ]

  return (
    <section id="features" className="my-12 border-t-2 border-b-2 border-secondary py-12">
      <div className="mb-8">
        <div className="bg-secondary text-white inline-block px-3 py-1 text-xs font-bold mb-3">FEATURES</div>
        <h2 className="text-3xl md:text-4xl font-black mb-4">THE 6 TOOLS EVERY INDEPENDENT ARTIST NEEDS</h2>
        <p className="text-lg text-secondary/70 max-w-3xl">
          KOOL combines AI intelligence with music industry expertise to give independent artists the power of a full
          management team
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-background p-6 border-2 border-secondary hover:shadow-md transition-shadow">
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold text-secondary mb-2">{feature.title}</h3>
            <p className="text-secondary/70">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 border-l-4 border-primary pl-6 py-2">
        <p className="text-2xl md:text-3xl italic font-serif">
          "KOOL is revolutionizing how independent artists manage their careers. It's like having a world-class manager
          in your pocket."
        </p>
        <p className="mt-4 text-secondary/70 font-medium">— Music Industry Today</p>
      </div>
    </section>
  )
}
