import type { Metadata, Viewport } from 'next'
import { Inter, Outfit } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AuthProvider } from '@/components/session-provider'
import { MobileNav } from '@/components/mobile-nav'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: '--font-sans' })
const outfit = Outfit({ subsets: ["latin"], variable: '--font-outfit' })

export const metadata: Metadata = {
  title: 'JobLinkr | The Professional Freelance & Job Network',
  description: 'Connect with top talent and find elite opportunities. JobLinkr is the modern standard for professional networking and gig hiring.',
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
    { media: '(prefers-color-scheme: light)', color: '#F8FAFC' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground relative overflow-x-hidden pb-20 lg:pb-0">
        {/* Modern Background Accents */}
        <div className="fixed -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] -z-10 animate-pulse" />
        <div className="fixed -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '2s' }} />
        
        <AuthProvider>
          <SidebarProvider>
            <Toaster position="top-center" expand={false} richColors />
            {children}
            <MobileNav />
            <Analytics />
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
