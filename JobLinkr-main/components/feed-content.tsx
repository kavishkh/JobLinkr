'use client'

import { useState, useEffect } from 'react'
import { Composer } from '@/components/composer'
import { PostCard } from '@/components/post-card'
import { Post, currentUser } from '@/lib/mockData'
import { Skeleton } from '@/components/ui/skeleton'

interface FeedContentProps {
  initialPosts: Post[]
}

export function FeedContent({ initialPosts }: FeedContentProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [loading, setLoading] = useState(false)

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
    <div className="flex-1 w-full px-6 py-8">
      {/* Composer */}
      <Composer onSubmit={handleNewPost} userRole={currentUser.role} />

      {/* Posts Feed */}
      <div className="space-y-4 mt-6">
        {loading ? (
          // Skeleton loaders
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-card rounded-lg p-4 border border-border">
              <div className="flex gap-3 mb-4">
                <Skeleton className="w-12 h-12 rounded-full" />
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
          <div className="bg-card rounded-lg p-12 border border-border text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No posts yet
            </h3>
            <p className="text-muted-foreground">
              Be the first to share something! Create a post to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
