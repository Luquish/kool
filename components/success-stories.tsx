import { useEffect, useState } from "react"

const SUCCESS_STORIES = [
  {
    name: "Marcus Johnson",
    genre: "Hip-Hop Artist",
    location: "Atlanta, GA",
    quote: "KOOL found licensing opportunities I never would have discovered. My music is now in commercials and TV shows."
  },
  {
    name: "Elena Diaz",
    genre: "Latin Pop",
    location: "Miami, FL",
    quote: "The fan engagement tools helped me build a dedicated community. My concert tickets now sell out in minutes."
  },
  {
    name: "Jordan Lee",
    genre: "Indie Folk",
    location: "Portland, OR",
    quote: "KOOL's AI helped me identify my unique sound and audience. I've tripled my income in just 3 months."
  },
  {
    name: "Sarah Chen",
    genre: "Electronic",
    location: "Los Angeles, CA",
    quote: "KOOL's marketing tools helped me grow my monthly listeners from 1,000 to 50,000 in just 6 months."
  },
  {
    name: "Miguel Torres",
    genre: "Rock",
    location: "Mexico City, MX",
    quote: "Thanks to KOOL's international promotion features, I've built a strong fanbase across Latin America."
  },
  {
    name: "Lisa Parker",
    genre: "R&B",
    location: "Chicago, IL",
    quote: "The collaboration tools connected me with producers worldwide. My latest EP was produced entirely through KOOL."
  },
  {
    name: "David Kim",
    genre: "K-Pop",
    location: "Seoul, KR",
    quote: "KOOL's analytics helped me understand which songs resonated most with my audience. My streams have increased 400%."
  },
  {
    name: "Emma Wilson",
    genre: "Country",
    location: "Nashville, TN",
    quote: "I used KOOL's songwriting AI to overcome writer's block. Now I release new music every month."
  },
  {
    name: "James Foster",
    genre: "Jazz",
    location: "New Orleans, LA",
    quote: "KOOL's venue matching system helped me book my first national tour. I'm now performing full-time."
  },
  {
    name: "Sofia Rodriguez",
    genre: "Reggaeton",
    location: "San Juan, PR",
    quote: "KOOL's distribution network helped me reach audiences across the Caribbean. My latest single went viral in 5 countries."
  },
  {
    name: "Alex Thompson",
    genre: "Alternative Rock",
    location: "London, UK",
    quote: "Using KOOL's fanbase insights, I've optimized my tour locations. Every venue has been packed since."
  },
  {
    name: "Nina Patel",
    genre: "Bollywood Fusion",
    location: "Mumbai, IN",
    quote: "KOOL's cross-cultural promotion tools helped me blend traditional and modern sounds. My fusion tracks are trending worldwide."
  },
  {
    name: "Lucas Santos",
    genre: "Bossa Nova",
    location: "Rio de Janeiro, BR",
    quote: "KOOL's playlist placement feature got my music into major Brazilian playlists. My monthly listeners doubled in weeks."
  },
  {
    name: "Yuki Tanaka",
    genre: "J-Pop",
    location: "Tokyo, JP",
    quote: "KOOL's merchandise platform helped me design and sell exclusive merch. Fan engagement is at an all-time high."
  },
  {
    name: "Marie Laurent",
    genre: "Electronic House",
    location: "Paris, FR",
    quote: "KOOL's event planning tools helped me organize successful underground shows. Now I'm booking major clubs across Europe."
  },
  {
    name: "Omar Hassan",
    genre: "Arabic Pop",
    location: "Dubai, UAE",
    quote: "KOOL's regional targeting helped me connect with Middle Eastern audiences. My music is now featured in local radio stations."
  },
  {
    name: "Isabella Rossi",
    genre: "Opera",
    location: "Milan, IT",
    quote: "KOOL's classical music network connected me with prestigious venues. I've performed in historic opera houses worldwide."
  },
  {
    name: "Thomas Berg",
    genre: "Techno",
    location: "Berlin, DE",
    quote: "KOOL's event promotion tools helped me establish a monthly underground event. We're now the city's top electronic music venue."
  },
  {
    name: "Zara Williams",
    genre: "Neo Soul",
    location: "Philadelphia, PA",
    quote: "KOOL's studio booking feature connected me with top producers. My debut album was recorded in legendary studios."
  }
]

export default function SuccessStories() {
  // Duplicamos las historias para asegurar un movimiento continuo
  const allStories = [...SUCCESS_STORIES, ...SUCCESS_STORIES, ...SUCCESS_STORIES]

  return (
    <section id="artists" className="mb-12 border-t-2 border-secondary pt-12">
      <div className="mb-8">
        <div className="bg-primary text-white inline-block px-3 py-1 text-xs font-bold mb-3">KOOL STORIES</div>
        <h2 className="text-3xl md:text-4xl font-black mb-2">
          ARTISTS TRANSFORMING THEIR CAREERS WITH <span className="text-primary">KOOL</span>
        </h2>
        <p className="text-lg text-secondary/70">
          Meet the independent musicians who are using KOOL to reach new heights
        </p>
      </div>

      <div className="relative overflow-hidden">
        <style jsx>{`
          @keyframes slide {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-${100 / 3}%);
            }
          }
          .shadow-overlay::before,
          .shadow-overlay::after {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            width: 100px;
            z-index: 2;
            pointer-events: none;
          }
          .shadow-overlay::before {
            left: 0;
            background: linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%);
          }
          .shadow-overlay::after {
            right: 0;
            background: linear-gradient(to left, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%);
          }
        `}</style>
        <div className="shadow-overlay relative">
          <div 
            className="flex gap-6"
            style={{
              animation: 'slide 120s linear infinite',
              width: `${(allStories.length / 3) * 100}%`,
            }}
          >
            {allStories.map((story, index) => (
              <div 
                key={`${story.name}-${index}`}
                className="w-full md:w-1/3 flex-shrink-0 max-w-[400px]"
              >
                <div className="border-2 border-secondary p-4 h-full">
                  <div className="text-sm font-bold text-primary mb-1">QUICK STORY</div>
                  <h3 className="text-lg font-bold mb-1">{story.name}</h3>
                  <p className="text-sm text-secondary/70 mb-2">{story.genre} • {story.location}</p>
                  <p className="text-secondary/80 text-sm leading-snug">{story.quote}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
