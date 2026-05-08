'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Post } from '@/lib/mockData'
import { formatDistanceToNow } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, MessageCircle, Share2, MoreHorizontal, UserPlus } from 'lucide-react'
import { cn } from '@/lib/utils'
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
    <Card className="glass-card p-6 border-border/50 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-4">
          <Link href={`/profile/${post.author.id}`} className="group relative">
            <Avatar className="w-12 h-12 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback className="bg-primary/5 text-primary font-bold">{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {post.author.role === 'Employer' && (
              <div className="absolute -bottom-1 -right-1 size-5 bg-accent rounded-full border-2 border-background flex items-center justify-center">
                <Badge className="size-full p-0 bg-transparent" />
              </div>
            )}
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <Link href={`/profile/${post.author.id}`} className="font-bold text-foreground hover:text-primary transition-colors font-outfit">
                {post.author.name}
              </Link>
              {post.author.role === 'Employer' && (
                <Badge variant="secondary" className="px-2 py-0 h-4 bg-accent/10 text-accent border-none text-[9px] font-bold uppercase tracking-widest">
                  Hiring
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mt-0.5">
              <span>{formatDistanceToNow(post.timestamp, { addSuffix: true })}</span>
              <span className="size-0.5 rounded-full bg-muted-foreground/30" />
              <span>Public</span>
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
              <MoreHorizontal className="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass rounded-xl p-1 w-48 border-border/50">
            <DropdownMenuItem className="rounded-lg py-2 cursor-pointer font-medium text-sm">
              <UserPlus className="size-4 mr-2" /> Follow {post.author.name.split(' ')[0]}
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg py-2 cursor-pointer font-medium text-sm">
              <Share2 className="size-4 mr-2" /> Share Post
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      <div className="mb-6">
        <p className="text-foreground/90 whitespace-pre-wrap break-words leading-relaxed text-base font-medium">
          {displayContent}
          {isLongContent && !showFullContent && '...'}
        </p>

        {isLongContent && (
          <button
            onClick={() => setShowFullContent(!showFullContent)}
            className="text-primary text-sm font-bold mt-3 hover:opacity-80 transition-opacity"
          >
            {showFullContent ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Interactive Stats */}
      <div className="flex items-center justify-between mb-5 px-1">
        <div className="flex -space-x-1">
          <div className="size-6 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center z-20">
            <Heart className="size-3 text-primary fill-primary" />
          </div>
          <div className="size-6 rounded-full bg-accent/10 border-2 border-background flex items-center justify-center z-10 translate-x-1">
            <MessageCircle className="size-3 text-accent fill-accent" />
          </div>
          <span className="pl-4 text-xs font-bold text-muted-foreground">
            {post.likes + post.comments + post.shares} interactions
          </span>
        </div>
        
        <div className="flex gap-4 text-xs font-bold text-muted-foreground/70">
          <span>{post.comments} comments</span>
          <span>{post.shares} shares</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-4 border-t border-border/30">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex-1 gap-2 rounded-xl h-11 transition-all",
            post.liked ? "bg-destructive/5 text-destructive hover:bg-destructive/10" : "hover:bg-primary/5 hover:text-primary"
          )}
          onClick={onLike}
        >
          <Heart className={cn("size-5 transition-all", post.liked && "fill-destructive")} />
          <span className="font-bold">Like</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex-1 gap-2 rounded-xl h-11 hover:bg-accent/5 hover:text-accent transition-all"
        >
          <MessageCircle className="size-5" />
          <span className="font-bold">Comment</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex-1 gap-2 rounded-xl h-11 hover:bg-secondary transition-all"
        >
          <Share2 className="size-5" />
          <span className="font-bold">Share</span>
        </Button>
      </div>
    </Card>
  )
}

