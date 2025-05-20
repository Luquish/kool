import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export default function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "$19",
      description: "Perfect for emerging artists",
      features: ["AI Career Strategy", "Basic Analytics", "Release Planning", "Social Media Tools", "Email Support"],
    },
    {
      name: "Pro",
      price: "$49",
      description: "For serious independent artists",
      features: [
        "Everything in Starter",
        "Advanced Analytics",
        "Revenue Optimization",
        "Fan Engagement Tools",
        "Priority Support",
        "Collaboration Matching",
      ],
      popular: true,
    },
    {
      name: "Elite",
      price: "$99",
      description: "Complete career management",
      features: [
        "Everything in Pro",
        "Custom AI Training",
        "Industry Connections",
        "Playlist Pitching",
        "24/7 Support",
        "Distribution Services",
      ],
    },
  ]

  return (
    <section id="pricing" className="my-12 border-t-2 border-secondary pt-12">
      <div className="mb-8">
        <div className="bg-primary text-white inline-block px-3 py-1 text-xs font-bold mb-3">GET KOOL</div>
        <h2 className="text-3xl md:text-4xl font-black mb-2">JOIN THE <span className="text-primary">KOOL</span>TURE</h2>
        <p className="text-lg text-secondary/70">
          All plans include our core AI management features. Start with a 14-day free trial today and see how <span className="text-primary">KOOL</span>'s AI-powered management can take your career to the next level.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative pt-8">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`border-2 ${
              plan.popular ? "border-primary shadow-lg relative" : "border-secondary"
            }`}
          >
            {plan.popular && (
              <div className="bg-primary text-white text-center py-2 font-bold border-b border-primary text-sm absolute top-0 left-0 right-0 -translate-y-full">
                MOST POPULAR
              </div>
            )}
            <div className="p-6 flex flex-col h-full">
              <h3 className="text-2xl font-bold text-secondary mb-2">{plan.name}</h3>
              <div className="flex items-end mb-4">
                <span className="text-4xl font-black text-secondary">{plan.price}</span>
                <span className="text-secondary/70 ml-1">/month</span>
              </div>
              <p className="text-secondary/70 mb-6">{plan.description}</p>
              <Button
                className={`w-full ${
                  plan.popular
                    ? "bg-primary hover:bg-primary/90 text-white"
                    : "bg-secondary hover:bg-secondary/90 text-white"
                }`}
              >
                Subscribe
              </Button>
              <ul className="mt-6 space-y-3 flex-grow">
                {plan.features.map((feature, i) => (
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

      <div className="mt-12 bg-background border-2 border-secondary p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <div className="text-primary font-bold text-sm mb-2">SPECIAL OFFER</div>
            <h3 className="text-2xl font-bold">Get 2 Months Free With Annual Billing</h3>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-white">View Annual Plans</Button>
        </div>
      </div>
    </section>
  )
}
