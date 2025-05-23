import { Button } from "@/components/ui/button"
import { Check, ChevronDown } from "lucide-react"
import { useState } from "react"

export default function PricingSection() {
  const [expandedServices, setExpandedServices] = useState<number[]>([])

  const toggleService = (index: number) => {
    setExpandedServices(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const services = [
    {
      name: "Pitch Spotify",
      credits: 1,
      description: <>Optimize your presence on <span className="text-primary font-bold">Spotify</span> and increase your chances of being included in <span className="text-primary font-bold">editorial playlists</span>.</>,
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
      description: <>Develop an effective strategy for your <span className="text-primary font-bold">social media</span> and increase your <span className="text-primary font-bold">engagement</span>.</>,
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
      description: <>Create a <span className="text-primary font-bold">complete marketing strategy</span> for your music or upcoming <span className="text-primary font-bold">release</span>.</>,
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
      description: <>Manage your <span className="text-primary font-bold">copyright</span> and maximize your <span className="text-primary font-bold">publishing income</span>.</>,
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
      description: <>Plan your <span className="text-primary font-bold">live shows</span> and optimize your <span className="text-primary font-bold">strategy</span>.</>,
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
      description: <>Get <span className="text-primary font-bold">templates</span> and <span className="text-primary font-bold">advice</span> for your music contracts.</>,
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
      <div className="mb-8 flex justify-between items-start">
        <div>
          <div className="bg-primary text-white inline-block px-3 py-1 text-xs font-bold mb-3">THE KOOLKIT</div>
          <h2 className="text-3xl md:text-4xl font-black mb-2">JOIN THE <span className="text-primary">KOOL</span>TURE</h2>
          <p className="text-lg text-secondary/70">
            Each service costs 1 credit ($3 USD). Buy credits and use them in any service when you need them.
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 text-white py-3 px-8"
          onClick={() => window.location.href = '#'}
        >
          Buy Credits
        </Button>
      </div>

      <div className="flex flex-col space-y-3 max-w-3xl mx-auto">
        {services.map((service, index) => (
          <div key={index} className="relative">
            <div className="border-2 border-secondary hover:border-primary transition-colors duration-300">
              <div className="p-4">
                <h3 className="text-xl font-bold text-secondary mb-1">{service.name}</h3>
                <p className="text-secondary/70 text-sm mb-3">{service.description}</p>
                
                <button 
                  onClick={() => toggleService(index)}
                  className="flex items-center text-primary hover:text-primary/80 transition-colors text-sm group"
                >
                  See Features
                  <ChevronDown 
                    className={`ml-2 h-4 w-4 transition-transform duration-700 ease-in-out ${
                      expandedServices.includes(index) ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>

              <div className={`overflow-hidden transition-all duration-700 ease-in-out ${
                expandedServices.includes(index) 
                  ? 'max-h-[500px] opacity-100' 
                  : 'max-h-0 opacity-0'
              }`}>
                <div className="relative px-8">
                  <div className="pb-4">
                    <ul className="space-y-2">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-sm">
                          <Check className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                          <span className="text-secondary/80">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
