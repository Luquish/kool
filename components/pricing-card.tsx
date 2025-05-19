import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PricingCardProps {
  title: string
  price: string
  features: string[]
  cta: string
  popular?: boolean
  color: "orange" | "navy" | "mustard"
}

export default function PricingCard({ title, price, features, cta, popular = false, color }: PricingCardProps) {
  const colorClasses = {
    orange: {
      bg: "bg-orange-500",
      border: "border-orange-500",
      hover: "hover:bg-orange-600",
      text: "text-orange-500",
    },
    navy: {
      bg: "bg-navy-blue",
      border: "border-navy-blue",
      hover: "hover:bg-navy-blue/90",
      text: "text-navy-blue",
    },
    mustard: {
      bg: "bg-mustard",
      border: "border-mustard",
      hover: "hover:bg-mustard/90",
      text: "text-mustard",
    },
  }

  return (
    <div
      className={`relative bg-white border-2 ${
        popular ? colorClasses[color].border : "border-gray-300"
      } p-8 transition-all duration-300`}
    >
      {popular && (
        <div
          className={`absolute top-0 right-0 ${colorClasses[color].bg} text-white text-xs font-bold uppercase tracking-wider py-1 px-3 transform translate-x-2 -translate-y-2`}
        >
          Popular
        </div>
      )}
      <div className="text-sm font-bold uppercase tracking-wider mb-4 heading-display">{title}</div>
      <div className="flex items-baseline mb-6">
        <span className="text-4xl font-extrabold heading-display">${price}</span>
        <span className="text-gray-500 ml-2">/month</span>
      </div>
      <Button
        className={`w-full mb-8 ${
          popular
            ? `${colorClasses[color].bg} ${colorClasses[color].hover} text-white`
            : "bg-black text-white hover:bg-gray-800"
        }`}
      >
        {cta}
      </Button>
      <ul className="space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className={`w-5 h-5 ${colorClasses[color].text} mr-2 flex-shrink-0 mt-0.5`} />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
