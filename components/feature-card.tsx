import type { ReactNode } from "react"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  color: "orange" | "navy" | "mustard"
}

export default function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  const colorClasses = {
    orange: "bg-orange-500 text-white",
    navy: "bg-navy-blue text-white",
    mustard: "bg-mustard text-black",
  }

  return (
    <div className="relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-16 h-16 -translate-x-8 -translate-y-8 transform rotate-45 bg-cream"></div>
      <div className={`p-8 ${colorClasses[color]} transition-all duration-300`}>
        <div className="mb-6 text-current">{icon}</div>
        <h3 className="text-2xl font-bold mb-4 heading-display">{title}</h3>
        <p className="text-current/90">{description}</p>
      </div>
    </div>
  )
}
