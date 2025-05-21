export default function AboutUs() {
  return (
    <section id="about" className="my-12 border-t-2 border-secondary pt-12">
      <div className="mb-8">
        <div className="bg-secondary text-white inline-block px-3 py-1 text-xs font-bold mb-3">ABOUT US</div>
        <h2 className="text-3xl md:text-4xl font-black mb-2">REVOLUTIONIZING THE MUSIC INDUSTRY</h2>
        <p className="text-lg text-secondary/70">
          KOOL is an innovative platform combining AI and music industry expertise to empower independent artists.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="aspect-video bg-background mb-4">
            <img
              src="/placeholder.svg?height=300&width=500"
              alt="Our Mission"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="bg-primary text-white inline-block px-3 py-1 text-xs font-bold mb-2">OUR MISSION</div>
          <h3 className="text-xl font-bold mb-2">Democratizing Musical Success</h3>
          <p className="text-secondary/70 text-sm mb-4">
            Our mission is to provide independent artists with the tools and resources traditionally only available to artists signed with major record labels.
          </p>
        </div>

        <div>
          <div className="aspect-video bg-background mb-4">
            <img
              src="/placeholder.svg?height=300&width=500"
              alt="Our Technology"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="bg-secondary text-white inline-block px-3 py-1 text-xs font-bold mb-2">TECHNOLOGY</div>
          <h3 className="text-xl font-bold mb-2">Powered by Advanced AI</h3>
          <p className="text-secondary/70 text-sm mb-4">
            We utilize cutting-edge AI technology to analyze music trends, optimize promotion strategies, and maximize artist reach.
          </p>
        </div>

        <div>
          <div className="aspect-video bg-background mb-4">
            <img
              src="/placeholder.svg?height=300&width=500"
              alt="Our Team"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="bg-primary text-white inline-block px-3 py-1 text-xs font-bold mb-2">OUR TEAM</div>
          <h3 className="text-xl font-bold mb-2">
            Music and Innovation Experts
          </h3>
          <p className="text-secondary/70 text-sm mb-4">
            Our team combines decades of music industry experience with deep expertise in technology and AI.
          </p>
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
              "KOOL represents the future of music management, where technology and creativity unite to create unprecedented opportunities for independent artists."
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
