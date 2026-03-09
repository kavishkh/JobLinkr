import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import { SidebarProvider } from '@/components/ui/sidebar'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: '--font-sans' })
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-serif' })

export const metadata: Metadata = {
  title: 'JobLinkr - Modern Job & Freelance Platform',
  description: 'Connect with top talent and opportunities. JobLinkr blends LinkedIn-style networking with Fiverr-like gig hiring.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAFAFA' },
    { media: '(prefers-color-scheme: dark)', color: '#0F172A' },
  ],
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <SidebarProvider>
          <Toaster />
          {children}
          <Analytics />
        </SidebarProvider>
      </body>
    </html>
  )
}
