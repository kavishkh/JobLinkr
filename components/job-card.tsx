'use client'

import Link from 'next/link'
import { Job } from '@/lib/mockData'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Briefcase, Users, DollarSign, Clock, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Entry':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
      case 'Mid':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
      case 'Senior':
        return 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20'
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Full-time':
        return 'bg-primary/10 text-primary border-primary/20'
      case 'Contract':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
      case 'Freelance':
        return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20'
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
    }
  }

  return (
    <Link href={`/jobs/${job.id}`}>
      <Card className="glass-card p-6 border-border/50 transition-all duration-300 cursor-pointer group hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-primary/5">
        <div className="mb-4">
          {/* Header Section */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold text-primary uppercase tracking-widest">{job.company}</span>
                <span className="size-1 rounded-full bg-border" />
                <span className="text-xs font-medium text-muted-foreground">{formatDistanceToNow(job.posted, { addSuffix: true })}</span>
              </div>
              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-2 font-outfit">
                {job.title}
                <ArrowUpRight className="size-4 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </h3>
            </div>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5 shadow-lg shadow-primary/20 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
              onClick={(e) => {
                e.preventDefault()
              }}
            >
              Apply Now
            </Button>
          </div>

          {/* Badges Section */}
          <div className="flex gap-2 flex-wrap mb-4">
            <Badge variant="outline" className={cn("rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider border", getLevelColor(job.level))}>
              {job.level}
            </Badge>
            <Badge variant="outline" className={cn("rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider border", getTypeColor(job.type))}>
              {job.type}
            </Badge>
            {job.salary && (
              <Badge variant="secondary" className="rounded-full px-3 py-0.5 text-[10px] font-bold bg-secondary text-secondary-foreground border-none">
                <DollarSign className="w-3 h-3 mr-0.5" />
                {job.salary.min.toLocaleString()}-{job.salary.max.toLocaleString()}
              </Badge>
            )}
          </div>

          {/* Details & Location */}
          <div className="flex items-center gap-5 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary/60" />
              <span className="font-medium">{job.location}</span>
            </div>
            {job.applicants && (
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-primary/60" />
                <span className="font-medium">{job.applicants} applicants</span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-6 font-medium">
            {job.description}
          </p>

          {/* Skills Section */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex gap-2 flex-wrap">
              {job.skills.slice(0, 3).map(skill => (
                <div key={skill} className="px-2.5 py-1 rounded-lg bg-secondary/50 text-[10px] font-bold text-muted-foreground border border-border/50 uppercase tracking-wider">
                  {skill}
                </div>
              ))}
              {job.skills.length > 3 && (
                <div className="px-2.5 py-1 rounded-lg bg-secondary/30 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider">
                  +{job.skills.length - 3}
                </div>
              )}
            </div>
            <div className="text-[10px] font-bold text-primary hover:underline transition-all">View details</div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

