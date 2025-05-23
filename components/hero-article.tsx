import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HeroArticle() {
  return (
    <section className="h-screen relative flex items-center justify-center">
      {/* Imagen de fondo que cubre toda la pantalla */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src="/images/KOOL.png"
          alt="KOOL Background"
          className="w-full h-full object-cover object-[30%_center] md:object-center"
        />
        {/* Overlay para mejorar legibilidad del texto */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Contenido centrado */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <h1 className="text-5xl md:text-8xl font-black text-white mb-6">
          Strategy Never Looked This <span className="text-primary">KOOL</span>
        </h1>
        
        <p className="text-xl md:text-2xl font-medium mb-10 text-white">
        We give you the insights and tools a pro manager would - without the middleman.
        </p>
        
        <Link href="/chat">
          <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg">
            Strategize Now
          </Button>
        </Link>
      </div>
    </section>
  )
}
