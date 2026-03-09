'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Post } from '@/lib/mockData'
import { formatDistanceToNow } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface PostCardProps {
  post: Post
  onLike?: () => void
}

export function PostCard({ post, onLike }: PostCardProps) {
  const [showFullContent, setShowFullContent] = useState(false)

  const isLongContent = post.content.length > 280
  const displayContent = showFullContent ? post.content : post.content.substring(0, 280)

  return (
    <Card className="p-6 border border-border hover:border-accent transition-colors">
      {/* Header - Minimal and clean */}
      <div className="flex items-start gap-4 mb-6">
        <Link href={`/profile/${post.author.id}`} className="flex-shrink-0">
          <Avatar className="w-10 h-10 hover:ring-2 ring-primary ring-offset-2 transition-all cursor-pointer">
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Link>

        <Link href={`/profile/${post.author.id}`} className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-foreground text-sm hover:text-primary transition-colors">
              {post.author.name}
            </h4>
            {post.author.role === 'Employer' && (
              <span className="text-xs font-medium text-accent">Hiring</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(post.timestamp, { addSuffix: true })}
          </p>
        </Link>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-foreground whitespace-pre-wrap break-words leading-relaxed">
          {displayContent}
          {isLongContent && !showFullContent && '...'}
        </p>

        {isLongContent && !showFullContent && (
          <button
            onClick={() => setShowFullContent(true)}
            className="text-primary text-sm font-semibold mt-2 hover:underline"
          >
            Show more
          </button>
        )}

        {showFullContent && isLongContent && (
          <button
            onClick={() => setShowFullContent(false)}
            className="text-primary text-sm font-semibold mt-2 hover:underline"
          >
            Show less
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-border mb-4" />

      {/* Stats */}
      <div className="flex gap-6 text-xs text-muted-foreground mb-4 px-2">
        {post.likes > 0 && (
          <button className="hover:text-primary transition-colors">
            {post.likes} {post.likes === 1 ? 'like' : 'likes'}
          </button>
        )}
        {post.comments > 0 && (
          <button className="hover:text-primary transition-colors">
            {post.comments} {post.comments === 1 ? 'comment' : 'comments'}
          </button>
        )}
        {post.shares > 0 && (
          <button className="hover:text-primary transition-colors">
            {post.shares} {post.shares === 1 ? 'share' : 'shares'}
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-border mb-4" />

      {/* Actions */}
      <div className="flex items-center justify-around -mx-2">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 text-muted-foreground hover:text-primary gap-2 justify-center"
          onClick={onLike}
        >
          <Heart
            className={`w-5 h-5 ${post.liked ? 'fill-destructive text-destructive' : ''} transition-colors`}
          />
          <span className="hidden sm:inline text-sm">Like</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex-1 text-muted-foreground hover:text-primary gap-2 justify-center"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="hidden sm:inline text-sm">Comment</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex-1 text-muted-foreground hover:text-primary gap-2 justify-center"
        >
          <Share2 className="w-5 h-5" />
          <span className="hidden sm:inline text-sm">Share</span>
        </Button>
      </div>
    </Card>
  )
}
