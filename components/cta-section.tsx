import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export default function CtaSection() {
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
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-secondary mb-4">Ready to Transform Your Music Career?</h2>
          <p className="text-lg text-secondary/70 max-w-2xl mx-auto">
            Choose the plan that fits your career stage and goals. All plans include our core AI management features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-lg overflow-hidden border ${
                plan.popular ? "border-primary shadow-lg relative" : "border-secondary"
              }`}
            >
              {plan.popular && <div className="bg-primary text-white text-center py-2 font-bold">MOST POPULAR</div>}
              <div className="p-8">
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
                  Get Started
                </Button>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-2" />
                      <span className="text-secondary/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Magazine-style call to action */}
        <div className="mt-20 bg-secondary text-white rounded-lg p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h3 className="text-2xl md:text-4xl font-bold mb-4">Start Your 14-Day Free Trial</h3>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Experience the power of AI-driven music management with no commitment. Cancel anytime during your trial
            period.
          </p>
          <Button className="bg-primary hover:bg-primary/90 text-white text-lg px-8 py-6">
            Start Free Trial — No Credit Card Required
          </Button>
        </div>
      </div>
    </section>
  )
}
