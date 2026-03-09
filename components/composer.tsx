'use client'

import { useState } from 'react'
import { currentUser } from '@/lib/mockData'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Image, Send } from 'lucide-react'
import { toast } from 'sonner'

interface ComposerProps {
  onSubmit: (content: string) => void
  userRole: 'Seeker' | 'Employer'
}

export function Composer({ onSubmit, userRole }: ComposerProps) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const placeholder = userRole === 'Employer'
    ? 'Share a job opening, company update, or hiring tip...'
    : 'Share an update, achievement, or ask for advice...'

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error('Please write something before posting')
      return
    }

    setIsSubmitting(true)
    // Simulate submission delay
    setTimeout(() => {
      onSubmit(content)
      setContent('')
      setIsSubmitting(false)
      toast.success('Post published!')
    }, 1000)
  }

  return (
    <Card className="p-6 border border-border">
      <div className="flex gap-4">
        {/* Avatar */}
        <Avatar className="w-10 h-10 flex-shrink-0">
          <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
          <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
        </Avatar>

        {/* Input Area */}
        <div className="flex-1">
          <Textarea
            placeholder={placeholder}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-20 resize-none bg-muted border-0 rounded-sm text-sm placeholder:text-muted-foreground focus:ring-1 focus:ring-primary mb-3"
            disabled={isSubmitting}
          />

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Button
              size="sm"
              variant="ghost"
              className="text-muted-foreground hover:text-foreground p-0 h-auto"
              disabled={isSubmitting}
            >
              <Image className="w-4 h-4" />
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !content.trim()}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white px-6"
            >
              {isSubmitting ? 'Posting...' : 'Share'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
