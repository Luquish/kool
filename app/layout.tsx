import type { Metadata } from 'next'
import './globals.css'
import MagazineHeader from '@/components/magazine-header'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: 'Kool - Music Management Platform',
  description: 'Independent music management platform',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body>
        <ThemeProvider attribute="class" defaultTheme="light">
          <MagazineHeader />
          <div className="pt-32">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
