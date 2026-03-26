import Link from 'next/link'
import Navbar from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { FeedContent } from '@/components/feed-content'
import { mockPosts } from '@/lib/mockData'

export default function Home() {
  // Server-side sorting of initial posts
  const initialPosts = [...mockPosts].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="flex gap-8">
        <Sidebar />
        <div className="flex-1 w-full px-6 py-8">
          <FeedContent initialPosts={initialPosts} />

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© 2026 JobLinkr. All rights reserved.</p>
            <div className="flex justify-center gap-4 mt-4 text-xs">
              <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
            </div>
          </footer>
        </div>
      </div>
    </main>
  )
}
