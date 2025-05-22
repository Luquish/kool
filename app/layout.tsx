import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import HeaderManager from '@/components/header-manager'

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
          <HeaderManager />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
