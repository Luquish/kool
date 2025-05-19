import Link from "next/link"
import { Instagram, Twitter, Youtube, Facebook, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function MagazineFooter() {
  return (
    <footer className="bg-secondary text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <h2 className="font-serif italic text-4xl font-bold text-white tracking-tighter transform -rotate-2 mb-4">
              KOOL
            </h2>
            <p className="text-white/70 mb-6 max-w-md">
              The AI-powered platform that helps independent musicians create, promote, and monetize their music like
              never before.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-white/70 hover:text-white transition-colors">
                <Instagram className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-white/70 hover:text-white transition-colors">
                <Twitter className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-white/70 hover:text-white transition-colors">
                <Youtube className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-white/70 hover:text-white transition-colors">
                <Facebook className="h-6 w-6" />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-white/70 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-white transition-colors">
                  Press
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-white/70 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-white transition-colors">
                  Artist Stories
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-white transition-colors">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Magazine-style issue information */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-4 md:mb-0">
              <div className="text-sm">
                <span className="font-bold">KOOL MAGAZINE</span> • ISSUE 001 • MAY 2025
              </div>
              <div className="text-white/50 text-xs mt-1">The Future of Music Management</div>
            </div>
            <div className="flex items-center">
              <div className="mr-4">
                <div className="text-sm font-bold">Subscribe to Our Newsletter</div>
                <div className="text-white/50 text-xs">Get weekly updates and exclusive content</div>
              </div>
              <div className="flex">
                <Input
                  placeholder="Your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 w-40 md:w-auto"
                />
                <Button className="bg-primary hover:bg-primary/90 ml-2">
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-white/50 text-sm mb-4 md:mb-0">© 2025 KOOL. All rights reserved.</div>
          <div className="flex space-x-6">
            <Link href="#" className="text-white/50 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-white/50 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-white/50 hover:text-white text-sm transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
