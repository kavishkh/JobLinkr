'use client'

import { useState, useEffect } from 'react'
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

  useEffect(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('jobLinkrPosts')
    if (saved) {
      try {
        const savedPosts = JSON.parse(saved).map((p: any) => ({
          ...p,
          timestamp: new Date(p.timestamp)
        }))
        setPosts(savedPosts)
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, [])

  const handleNewPost = (content: string) => {
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
    setIsDialogOpen(false) // Close dialog after posting
  }

  const handleLike = (postId: string) => {
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

