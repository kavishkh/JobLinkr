'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Job } from '@/lib/mockData'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Briefcase, Users, DollarSign, Clock, ArrowUpRight, Bot, CheckCircle, Loader2, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useSavedJobs } from '@/hooks/use-saved-jobs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [useAiResume, setUseAiResume] = useState(true)
  const [aiRoleType, setAiRoleType] = useState('fullstack')
  const [isApplied, setIsApplied] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const { isSaved, toggleSaveJob } = useSavedJobs()
  const saved = isSaved(job.id)

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (useAiResume) {
      setIsApplying(true);
      toast.info('Analyzing job requirements...');
      await new Promise(r => setTimeout(r, 300));
      toast.success('AI Resume intelligently tailored for this role!');
      await new Promise(r => setTimeout(r, 200));
      setIsApplying(false);
    } else {
      toast.success('Application submitted successfully!');
    }
    setIsApplied(true);
    setIsDialogOpen(false);
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Only navigate if we aren't clicking the apply button or inside the dialog
    router.push(`/jobs/${job.id}`);
  }

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
    <div className="block">
      <Card 
        onClick={handleCardClick}
        className="glass-card p-6 border-border/50 transition-all duration-300 cursor-pointer group hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-primary/5"
      >
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
            {isApplied ? (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full px-5 shadow-lg transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsApplied(false)
                  }}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Applied
                </Button>
                <Button
                  size="sm"
                  variant={saved ? 'default' : 'outline'}
                  className="rounded-full px-3 shadow-lg transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleSaveJob(job.id)
                  }}
                >
                  <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5 shadow-lg shadow-primary/20 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                    >
                      Apply Now
                    </Button>
                  </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]" onClick={(e) => e.stopPropagation()}>
                  <form onSubmit={handleApply}>
                    <DialogHeader>
                      <DialogTitle>Apply for {job.title}</DialogTitle>
                      <DialogDescription>
                        Submit your application to {job.company}. Fill out the details below.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue="John Doe" required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="john@example.com" required />
                      </div>
                      
                      <div className="flex items-start space-x-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                        <Checkbox 
                          id="ai-resume" 
                          checked={useAiResume} 
                          onCheckedChange={(checked) => setUseAiResume(checked as boolean)}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <Label htmlFor="ai-resume" className="flex items-center gap-2 font-semibold">
                            <Bot className="w-4 h-4 text-primary" />
                            Use My AI Resume
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically attach your intelligently optimized AI Resume for this specific role.
                          </p>
                        </div>
                      </div>

                      {useAiResume && (
                        <div className="grid gap-2 bg-primary/5 p-4 rounded-lg border border-primary/10">
                          <Label htmlFor="role-type">Target Role Optimization</Label>
                          <Select value={aiRoleType} onValueChange={setAiRoleType}>
                            <SelectTrigger id="role-type" className="bg-background">
                              <SelectValue placeholder="Select target role..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="frontend">Frontend Developer</SelectItem>
                              <SelectItem value="backend">Backend Developer</SelectItem>
                              <SelectItem value="fullstack">Full-Stack Engineer</SelectItem>
                              <SelectItem value="devops">DevOps / Platform</SelectItem>
                              <SelectItem value="designer">UI/UX Designer</SelectItem>
                              <SelectItem value="data">Data Scientist</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-[11px] text-muted-foreground mt-1">
                            Your resume will be tailored to highlight {aiRoleType} skills to match the job.
                          </p>
                        </div>
                      )}

                      {!useAiResume && (
                        <div className="grid gap-2">
                          <Label htmlFor="resume">Upload Resume</Label>
                          <Input id="resume" type="file" />
                        </div>
                      )}

                      <div className="grid gap-2">
                        <Label htmlFor="cover-letter">Cover Letter (Optional)</Label>
                        <Textarea 
                          id="cover-letter" 
                          placeholder="Why are you a great fit for this role?"
                          className="h-24"
                          defaultValue={useAiResume ? `Dear Hiring Manager,\n\nI am very interested in the ${job.title} position at ${job.company}. I believe my skills and experience align perfectly with your requirements.\n\nThank you for your consideration.` : ""}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={(e) => {
                        e.stopPropagation()
                        setIsDialogOpen(false)
                      }} disabled={isApplying}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isApplying}>
                        {isApplying ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Optimizing AI Resume...
                          </>
                        ) : (
                          "Submit Application"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              <Button
                  size="sm"
                  variant={saved ? 'default' : 'outline'}
                  className="rounded-full px-3 shadow-lg transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleSaveJob(job.id)
                  }}
                >
                  <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                </Button>
              </div>
            )}
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
                {job.salary.min.toLocaleString('en-US')}-{job.salary.max.toLocaleString('en-US')}
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
    </div>
  )
}

