import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export default function PricingSection() {
  const services = [
    {
      name: "Pitch Spotify",
      credits: 1,
      description: "Optimize your presence on Spotify and increase your chances of being included in editorial playlists.",
      features: [
        "Analyze your current profile",
        "Optimize metadata",
        "Pitch strategy",
        "Customized tracking"
      ]
    },
    {
      name: "Social Media Campaign",
      credits: 1,
      description: "Develop an effective strategy for your social media and increase your engagement.",
      features: [
        "Content planning",
        "Editorial calendar",
        "Hashtag strategy",
        "Metrics analysis"
      ]
    },
    {
      name: "Marketing Strategy",
      credits: 1,
      description: "Create a complete marketing strategy for your music or upcoming release.",
      features: [
        "Market analysis",
        "Action plan",
        "Content strategy",
        "Recommended budget"
      ]
    },
    {
      name: "Publishing",
      credits: 1,
      description: "Manage your copyright and maximize your publishing income.",
      features: [
        "Register your works",
        "Rights management",
        "Monetization strategy",
        "Royalty report"
      ]
    },
    {
      name: "Live Shows",
      credits: 1,
      description: "Plan your live shows and optimize your strategy.",
      features: [
        "Venue search",
        "Estimated budget",
        "Promotion plan",
        "Checklist pre-show"
      ]
    },
    {
      name: "Contracts",
      credits: 1,
      description: "Get templates and advice for your music contracts.",
      features: [
        "Customizable templates",
        "Basic review",
        "Main terms",
        "Negotiation guide"
      ]
    }
  ]

  return (
    <section id="services" className="my-12 border-t-2 border-secondary pt-12">
      <div className="mb-8">
        <div className="bg-primary text-white inline-block px-3 py-1 text-xs font-bold mb-3">KOOL SERVICES</div>
        <h2 className="text-3xl md:text-4xl font-black mb-2">JOIN THE <span className="text-primary">KOOL</span>TURE</h2>
        <p className="text-lg text-secondary/70">
          Each service costs 1 credit ($3 USD). Buy credits and use them in any service when you need them.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            className="border-2 border-secondary hover:border-primary transition-colors duration-300"
          >
            <div className="p-6 flex flex-col h-full">
              <h3 className="text-3xl font-bold text-secondary mb-2">{service.name}</h3>
              <div className="flex items-center mb-4">
                <span className="text-2xl font-black text-primary">{service.credits} credit</span>
              </div>
              <p className="text-secondary/70">{service.description}</p>
              <ul className="mt-6 space-y-3 flex-grow">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span className="text-secondary/80">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
