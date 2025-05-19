import { Quote } from "lucide-react"

interface TestimonialCardProps {
  quote: string
  name: string
  title: string
  location: string
  color: "orange" | "navy" | "mustard"
  bgColor?: string
  textColor?: string
}

export default function TestimonialCard({
  quote,
  name,
  title,
  location,
  color,
  bgColor = "black",
  textColor = "white",
}: TestimonialCardProps) {
  const colorClasses = {
    orange: "text-orange-500",
    navy: "text-navy-blue",
    mustard: "text-mustard",
  }

  const bgColorClass = bgColor === "white" ? "bg-white" : "bg-black"
  const textColorClass = textColor === "black" ? "text-black" : "text-white"
  const quoteTextClass = textColor === "black" ? "text-gray-700" : "text-gray-300"

  return (
    <div className={`${bgColorClass} border-2 border-gray-300 p-8 relative`}>
      <div className="absolute top-0 right-0 w-16 h-16 bg-black dot-pattern opacity-10"></div>
      <Quote className={`w-10 h-10 ${colorClasses[color]} mb-6`} />
      <p className={`text-lg mb-6 ${quoteTextClass}`}>"{quote}"</p>
      <div>
        <div className={`font-bold heading-display ${textColorClass}`}>{name}</div>
        <div className={textColor === "black" ? "text-gray-600" : "text-gray-400"}>{title}</div>
        <div className={textColor === "black" ? "text-gray-500" : "text-gray-500"} style={{ fontSize: "0.875rem" }}>
          {location}
        </div>
      </div>
    </div>
  )
}
