'use client'

import Link from 'next/link'
import { Job } from '@/lib/mockData'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Briefcase, Users, DollarSign, Clock } from 'lucide-react'

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Entry':
        return 'bg-green-100 text-green-800'
      case 'Mid':
        return 'bg-blue-100 text-blue-800'
      case 'Senior':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Full-time':
        return 'bg-primary/10 text-primary'
      case 'Contract':
        return 'bg-yellow-100 text-yellow-800'
      case 'Freelance':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Link href={`/jobs/${job.id}`}>
      <Card className="p-6 border border-border hover:border-accent transition-colors cursor-pointer group">
        <div className="mb-4">
          {/* Job Info */}
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {job.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {job.company}
              </p>
            </div>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white flex-shrink-0"
              onClick={(e) => {
                e.preventDefault()
              }}
            >
              Apply
            </Button>
          </div>

          {/* Location & Type */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3 flex-wrap">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job.location}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatDistanceToNow(job.posted, { addSuffix: true })}
            </div>
            {job.applicants && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {job.applicants} applied
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="flex gap-2 flex-wrap mb-3">
            <Badge className={getLevelColor(job.level)}>
              {job.level}
            </Badge>
            <Badge className={getTypeColor(job.type)}>
              {job.type}
            </Badge>
            {job.salary && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                {job.salary.min.toLocaleString()}-{job.salary.max.toLocaleString()}
              </Badge>
            )}
          </div>

          {/* Description Preview */}
          <p className="text-sm text-foreground leading-relaxed line-clamp-2 mb-3">
            {job.description}
          </p>

          {/* Skills */}
          <div className="flex gap-2 flex-wrap pt-3 border-t border-border">
            {job.skills.slice(0, 3).map(skill => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {job.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{job.skills.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </Link>

  )
}
