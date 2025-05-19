import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter, DM_Serif_Display } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

// Load fonts using Next.js font optimization
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

const dmSerifDisplay = DM_Serif_Display({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-dm-serif",
})

export const metadata: Metadata = {
  title: "KOOL - AI Manager for Independent Musicians",
  description:
    "KOOL is an AI-powered platform for independent musicians in Latin America, providing personalized strategies and tools for career growth.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${dmSerifDisplay.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
