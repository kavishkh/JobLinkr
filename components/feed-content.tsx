 'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { Composer } from '@/components/composer'
import { PostCard } from '@/components/post-card'
import { Post, currentUser } from '@/lib/mockData'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Sparkles, Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface FeedContentProps {
  initialPosts: Post[]
}

export function FeedContent({ initialPosts }: FeedContentProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    // Fetch posts from API
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/posts')
        if (res.ok) {
          const data = await res.json()
          const postsFromApi = (data.posts || []).map((p: any) => ({
            id: p._id || p.id,
            author: p.author,
            content: p.content,
            timestamp: p.createdAt ? new Date(p.createdAt) : new Date(),
            likes: p.likes || 0,
            comments: p.comments || 0,
            shares: p.shares || 0,
            liked: !!p.liked
          }))
          setPosts(postsFromApi)
        }
      } catch (e) {
        // ignore
      } finally {
        setLoading(false)
      }
    }

    load()

    // If there are legacy posts in localStorage and user is signed in, migrate them
    try {
      const saved = localStorage.getItem('jobLinkrPosts')
      if (saved && session?.user?.id) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          fetch('/api/migrate/local', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ posts: parsed })
          }).then(async (r) => {
            if (r.ok) {
              localStorage.removeItem('jobLinkrPosts')
              toast.success('Migrated your local posts to the server')
              // reload posts after migration
              const refetch = await fetch('/api/posts')
              if (refetch.ok) {
                const d = await refetch.json()
                const postsFromApi = (d.posts || []).map((p: any) => ({
                  id: p._id || p.id,
                  author: p.author,
                  content: p.content,
                  timestamp: p.createdAt ? new Date(p.createdAt) : new Date(),
                  likes: p.likes || 0,
                  comments: p.comments || 0,
                  shares: p.shares || 0,
                  liked: !!p.liked
                }))
                setPosts(postsFromApi)
              }
            }
          })
        }
      }
    } catch (e) {
      // ignore
    }
  }, [session])

  const handleNewPost = async (content: string) => {
    // Try to post to server. If unauthenticated, fallback to localStorage
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      })

      if (res.ok) {
        const data = await res.json()
        const p = data.post
        const serverPost: Post = {
          id: p._id || p.id,
          author: p.author,
          content: p.content,
          timestamp: p.createdAt ? new Date(p.createdAt) : new Date(),
          likes: p.likes || 0,
          comments: p.comments || 0,
          shares: p.shares || 0,
          liked: !!p.liked
        }
        setPosts([serverPost, ...posts])
        setIsDialogOpen(false)
        toast.success('Post published successfully!')
        return
      }

      const err = await res.json().catch(() => null)
      if (res.status === 401) {
        // Fall back to local storage
        const newPost: Post = {
          id: `post-${Date.now()}`,
          author: currentUser,
          content,
          timestamp: new Date(),
          likes: 0,
          comments: 0,
          shares: 0,
          liked: false
        }
        const updated = [newPost, ...posts]
        setPosts(updated)
        localStorage.setItem('jobLinkrPosts', JSON.stringify(updated))
        setIsDialogOpen(false)
        toast('Saved locally — sign in to sync')
        return
      }

      throw new Error(err?.error || 'Post failed')
    } catch (e: any) {
      // Fallback to local
      const newPost: Post = {
        id: `post-${Date.now()}`,
        author: currentUser,
        content,
        timestamp: new Date(),
        likes: 0,
        comments: 0,
        shares: 0,
        liked: false
      }
      const updated = [newPost, ...posts]
      setPosts(updated)
      localStorage.setItem('jobLinkrPosts', JSON.stringify(updated))
      setIsDialogOpen(false)
      toast.error('Failed to publish — saved locally')
    }
  }

  const handleLike = async (postId: string) => {
    // Optimistic UI update
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        }
      }
      return post
    }))

    if (session?.user?.id) {
      try {
        const res = await fetch(`/api/posts/${postId}/like`, { method: 'POST' })
        if (res.ok) {
          const data = await res.json()
          const p = data.post
          setPosts(prev => prev.map(post => post.id === (p._id || p.id) ? ({
            ...post,
            likes: p.likes || 0,
            liked: !!p.liked
          }) : post))
          return
        }
        throw new Error('Like failed')
      } catch (e) {
        // On failure, refetch posts to sync state
        try {
          const refetch = await fetch('/api/posts')
          if (refetch.ok) {
            const d = await refetch.json()
            const postsFromApi = (d.posts || []).map((p: any) => ({
              id: p._id || p.id,
              author: p.author,
              content: p.content,
              timestamp: p.createdAt ? new Date(p.createdAt) : new Date(),
              likes: p.likes || 0,
              comments: p.comments || 0,
              shares: p.shares || 0,
              liked: !!p.liked
            }))
            setPosts(postsFromApi)
          }
        } catch (e) {
          // ignore
        }
      }
    } else {
      // Not signed in: persist to local storage as fallback
      const updated = posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1
          }
        }
        return post
      })
      setPosts(updated)
      try {
        localStorage.setItem('jobLinkrPosts', JSON.stringify(updated))
      } catch (e) {}
    }
  }

  const handleComment = async (postId: string) => {
    // Prompt user for comment text
    const text = typeof window !== 'undefined' ? window.prompt('Write a comment:') : null
    if (!text || !text.trim()) return

    // Optimistic update
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, comments: (post.comments || 0) + 1 }
      }
      return post
    }))

    if (session?.user?.id) {
      try {
        const res = await fetch(`/api/posts/${postId}/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: text })
        })
        if (res.ok) {
          const data = await res.json()
          const p = data.post
          setPosts(prev => prev.map(post => post.id === (p._id || p.id) ? ({
            ...post,
            comments: p.comments || 0
          }) : post))
          toast.success('Comment posted')
          return
        }
        throw new Error('Comment failed')
      } catch (e) {
        // On failure, refetch posts to reconcile
        try {
          const refetch = await fetch('/api/posts')
          if (refetch.ok) {
            const d = await refetch.json()
            const postsFromApi = (d.posts || []).map((p: any) => ({
              id: p._id || p.id,
              author: p.author,
              content: p.content,
              timestamp: p.createdAt ? new Date(p.createdAt) : new Date(),
              likes: p.likes || 0,
              comments: p.comments || 0,
              shares: p.shares || 0,
              liked: !!p.liked
            }))
            setPosts(postsFromApi)
          }
        } catch (e) {
          // ignore
        }
      }
    } else {
      // Not signed in: prompt to sign in and keep local increment
      toast('Saved locally — sign in to sync', { icon: '💾' })
      try { localStorage.setItem('jobLinkrPosts', JSON.stringify(posts)) } catch (e) {}
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header with New Post Button */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-border/50">
        <div>
          <h2 className="text-2xl font-bold tracking-tight font-outfit">Community Feed</h2>
          <p className="text-sm text-muted-foreground font-medium">See what's happening in your network</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-6 font-bold shadow-lg shadow-primary/20 flex items-center gap-2 h-12 transition-all hover:scale-105">
              <Plus className="size-5" />
              <span>Create Post</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none glass rounded-3xl">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="text-xl font-bold font-outfit flex items-center gap-2">
                <Sparkles className="size-5 text-primary" />
                Share an Update
              </DialogTitle>
            </DialogHeader>
            <div className="p-6 pt-2">
              <Composer onSubmit={handleNewPost} userRole={currentUser.role} />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {loading ? (
          // Skeleton loaders
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 border border-border/50">
              <div className="flex gap-4 mb-4">
                <Skeleton className="size-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))
        ) : posts.length > 0 ? (
          posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onLike={() => handleLike(post.id)}
              onComment={() => handleComment(post.id)}
            />
          ))
        ) : (
          <div className="glass-card rounded-2xl p-16 border border-border/50 text-center">
            <div className="size-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="size-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2 font-outfit">
              Your feed is empty
            </h3>
            <p className="text-muted-foreground font-medium mb-8">
              Start by sharing an update or following people in your network.
            </p>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              variant="outline" 
              className="rounded-full px-8 font-bold"
            >
              Share your first post
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

