import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import HeaderManager from '@/components/header-manager'
import { StagewiseToolbar } from '@stagewise/toolbar-next'

const stagewiseConfig = {
  plugins: []
}

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
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <HeaderManager />
          {children}
          {process.env.NODE_ENV === 'development' && (
            <StagewiseToolbar config={stagewiseConfig} />
          )}
        </ThemeProvider>
      </body>
    </html>
  )
}
