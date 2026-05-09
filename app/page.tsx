import Link from 'next/link'
import Navbar from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { FeedContent } from '@/components/feed-content'
import { mockPosts } from '@/lib/mockData'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Home() {
  // Server-side sorting of initial posts
  const initialPosts = [...mockPosts].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  return (
    <main className="min-h-screen bg-background w-full flex-1 flex-col flex selection:bg-primary/20 selection:text-primary">
      <Navbar />

      <div className="flex gap-0 lg:gap-8 max-w-[1600px] mx-auto w-full">
        <Sidebar />
        
        <div className="flex-1 w-full px-4 sm:px-8 py-10">
          <FeedContent initialPosts={initialPosts} />

          {/* Footer */}
          <footer className="mt-24 pb-12 border-t border-border/50">
            <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">J</div>
                <span className="font-bold text-xl tracking-tight">JobLinkr</span>
              </div>
              
              <div className="flex gap-8 text-sm font-semibold text-muted-foreground">
                <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
                <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
                <Link href="#" className="hover:text-primary transition-colors">Help Center</Link>
                <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
              </div>

              <p className="text-sm font-medium text-muted-foreground/60">
                © 2026 JobLinkr Inc.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </main>
  )
}

