export default function AboutUs() {
  return (
    <section id="about" className="my-12 border-t-2 border-secondary pt-12">
      <div className="mb-8">
        <div className="bg-secondary text-white inline-block px-3 py-1 text-xs font-bold mb-3">OUR VISION</div>
        <h2 className="text-3xl md:text-4xl font-black mb-2">REVOLUTIONIZING THE MUSIC INDUSTRY</h2>
        <p className="text-lg text-secondary/70">
          We believe that every artist deserves the chance to grow, connect and monetize — regardless of time, money or access. KOOL was built to remove the friction that stops most emerging talents from going pro.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="aspect-[4/3] bg-background mb-4">
            <img
              src="/images/accessibility.png"
              alt="Our Mission"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="bg-primary text-white inline-block px-3 py-1 text-xs font-bold mb-2">OUR MISSION</div>
          <h3 className="text-xl font-bold mb-2">Accessibility</h3>
        </div>

        <div>
          <div className="aspect-[4/3] bg-background mb-4">
            <img
              src="/images/sustainability_and_autonomy.png"
              alt="Our Technology"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="bg-secondary text-white inline-block px-3 py-1 text-xs font-bold mb-2">TECHNOLOGY</div>
          <h3 className="text-xl font-bold mb-2">Sustainability and Autonomy</h3>
        </div>

        <div>
          <div className="aspect-[4/3] bg-background mb-4">
            <img
              src="/images/team.png"
              alt="Our Team"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="bg-primary text-white inline-block px-3 py-1 text-xs font-bold mb-2">OUR TEAM</div>
          <h3 className="text-xl font-bold mb-2">
            Multidisciplinary Business Experts
          </h3>
        </div>
      </div>

      <div className="mt-12 bg-secondary text-white p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <div className="text-primary font-bold mb-2">OUR VISION</div>
            <h3 className="text-2xl md:text-3xl font-bold">
              "We believe in a future where every artist has the opportunity to reach their full potential"
            </h3>
          </div>
          <div className="mt-4 md:mt-0 md:ml-8 text-white/80">
            <p className="italic mb-2">
              "Based on our survey, 9 out of 10 artists believe a clear strategy could change the course of their careers. KOOL helps them build one — and sustain it."
            </p>
            <p className="text-sm">
              <span className="font-bold">Faustina Bagnat</span> • CEO & Founder
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
