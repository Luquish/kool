import { Mic, TrendingUp, DollarSign, Calendar, Users, BarChart } from "lucide-react"

export default function FeaturesSection() {
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
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-secondary mb-4">Your Digital Music Manager</h2>
          <p className="text-lg text-secondary/70 max-w-2xl mx-auto">
            KOOL combines AI intelligence with music industry expertise to give independent artists the power of a full
            management team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-background p-8 rounded-lg border border-secondary hover:shadow-lg transition-shadow"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-secondary mb-2">{feature.title}</h3>
              <p className="text-secondary/70">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Magazine-style pull quote */}
        <div className="mt-16 border-l-4 border-primary pl-6 max-w-3xl mx-auto">
          <p className="text-2xl md:text-3xl italic text-secondary font-serif">
            "KOOL is revolutionizing how independent artists manage their careers. It's like having a world-class
            manager in your pocket."
          </p>
          <p className="mt-4 text-secondary/70 font-medium">— Music Industry Today</p>
        </div>
      </div>
    </section>
  )
}
