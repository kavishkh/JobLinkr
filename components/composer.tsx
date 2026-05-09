'use client'

import { useState } from 'react'
import { currentUser } from '@/lib/mockData'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Image, Send, FileText, Calendar, MoreHorizontal, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface ComposerProps {
  onSubmit: (content: string) => void
  userRole: 'Seeker' | 'Employer'
}

export function Composer({ onSubmit, userRole }: ComposerProps) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const placeholder = userRole === 'Employer'
    ? 'Share a new job opening, company milestone, or hiring advice...'
    : 'What\'s on your mind? Share an achievement or ask for career advice...'

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error('Please write something before posting')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      onSubmit(content)
      setContent('')
      setIsSubmitting(false)
      toast.success('Post published successfully!')
    }, 1000)
  }

  return (
    <Card className={cn(
      "glass-card p-6 border-border/50 transition-all duration-500",
      isFocused ? "ring-2 ring-primary/10 bg-white/60 dark:bg-slate-900/60 shadow-glow" : ""
    )}>
      <div className="flex gap-4">
        <Avatar className="w-12 h-12 flex-shrink-0 border-2 border-background shadow-premium">
          <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
          <AvatarFallback className="bg-primary/5 text-primary font-bold">{currentUser.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <Textarea
            placeholder={placeholder}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="min-h-[100px] resize-none bg-transparent border-none text-base placeholder:text-muted-foreground/60 focus-visible:ring-0 p-0 mb-4 font-medium"
            disabled={isSubmitting}
          />

          <div className="flex items-center justify-between pt-4 border-t border-border/30">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="size-9 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                title="Add Image"
              >
                <Image className="size-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-9 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                title="Add Document"
              >
                <FileText className="size-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-9 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                title="Schedule Post"
              >
                <Calendar className="size-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-9 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                title="AI Assist"
              >
                <Sparkles className="size-5" />
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-widest transition-opacity duration-300",
                content.length > 0 ? "opacity-40" : "opacity-0"
              )}>
                {content.length} / 500
              </span>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !content.trim()}
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 h-10"
              >
                {isSubmitting ? (
                  <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="size-4" />
                    <span>Post</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

