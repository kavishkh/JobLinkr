'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Sparkles,
  Heart,
  X,
  ExternalLink,
  MapPin,
  DollarSign,
  Users,
  TrendingUp,
  CheckCircle,
  Upload,
  FileText,
  Briefcase as BriefcaseIcon,
} from 'lucide-react'
import Navbar from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const mockMatches = [
  {
    id: '1',
    title: 'Senior Product Designer',
    company: 'Tech Innovations Inc.',
    location: 'San Francisco, CA',
    salary: '$120K - $160K',
    matchScore: 98,
    reason: 'Your skills align perfectly with their design needs',
    skills: ['UI Design', 'Design Systems', 'Figma'],
    applicants: 42,
  },
  {
    id: '2',
    title: 'UX Lead',
    company: 'Creative Studios',
    location: 'Remote',
    salary: '$100K - $140K',
    matchScore: 95,
    reason: 'Strong experience match with leadership opportunities',
    skills: ['UX Research', 'UI Design', 'Team Leadership'],
    applicants: 28,
  },
  {
    id: '3',
    title: 'Design System Architect',
    company: 'Global Tech Corp',
    location: 'New York, NY',
    salary: '$130K - $170K',
    matchScore: 92,
    reason: 'Your design systems expertise is exactly what they need',
    skills: ['Design Systems', 'Figma', 'Documentation'],
    applicants: 15,
  },
]

export default function MatcherPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [liked, setLiked] = useState<string[]>([])
  const [passed, setPassed] = useState<string[]>([])
  const [step, setStep] = useState<'onboarding' | 'matching'>('onboarding')
  const [resume, setResume] = useState<File | null>(null)
  const [jobType, setJobType] = useState<string>('Full-time')

  const currentJob = mockMatches[currentIndex]
  const isLiked = liked.includes(currentJob?.id)
  const isPassed = passed.includes(currentJob?.id)

  const handleLike = () => {
    if (!isLiked) {
      setLiked([...liked, currentJob.id])
    }
    handleNext()
  }

  const handlePass = () => {
    if (!isPassed) {
      setPassed([...passed, currentJob.id])
    }
    handleNext()
  }

  const handleNext = () => {
    if (currentIndex < mockMatches.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setCurrentIndex(mockMatches.length)
    }
  }

  if (step === 'onboarding') {
    return (
      <main className="min-h-screen bg-background text-foreground w-full">
        <Navbar />
        <div className="flex gap-8">
          <Sidebar />
          <div className="flex-1 w-full px-6 py-8">
            <div className="w-full">
              {/* Step Indicator */}
              <div className="flex items-center justify-center gap-4 mb-12">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">1</div>
                  <span className="font-medium text-foreground text-sm">Background</span>
                </div>
                <div className="w-12 h-px bg-border" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold text-sm">2</div>
                  <span className="font-medium text-muted-foreground text-sm">Matching</span>
                </div>
              </div>

              <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold mb-2 tracking-tight">Let's build your AI profile</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Our AI needs to understand your experience and goals to find the best opportunities for you.
                </p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                <div className="xl:col-span-8 flex flex-col gap-6">
                  {/* Resume Upload */}
                  <Card
                    className={`flex-1 relative p-12 lg:p-16 border-2 border-dashed transition-all cursor-pointer group hover:border-primary/40 hover:bg-primary/[0.02] ${resume ? 'border-primary bg-primary/[0.02]' : 'border-border'}`}
                    onClick={() => document.getElementById('resume-upload')?.click()}
                  >
                    <input
                      id="resume-upload"
                      type="file"
                      className="hidden"
                      onChange={(e) => setResume(e.target.files?.[0] || null)}
                    />
                    <div className="flex flex-col items-center justify-center h-full">
                      {resume ? (
                        <>
                          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                            <FileText className="w-8 h-8 text-primary" />
                          </div>
                          <h3 className="text-xl font-bold mb-2">{resume.name}</h3>
                          <p className="text-sm text-muted-foreground mb-6">{(resume.size / 1024 / 1024).toFixed(2)} MB • Ready for analysis</p>
                          <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setResume(null); }}>
                            Change File
                          </Button>
                        </>
                      ) : (
                        <>
                          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/10 transition-all">
                            <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary" />
                          </div>
                          <h3 className="text-xl font-bold mb-3">Upload Resume</h3>
                          <p className="text-muted-foreground text-center text-base">
                            Drop your resume here or click to browse.<br />
                            Supports PDF, DOCX (Max 5MB)
                          </p>
                        </>
                      )}
                    </div>
                  </Card>
                </div>

                <div className="xl:col-span-4 flex flex-col gap-6">
                  <Card className="p-8">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                      <BriefcaseIcon className="w-4 h-4 text-primary" />
                      Job Preferences
                    </h3>

                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-3 block">I'm looking for</label>
                        <Select value={jobType} onValueChange={setJobType}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Job Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Full-time">Full-time Roles</SelectItem>
                            <SelectItem value="Contract">Contract / Project</SelectItem>
                            <SelectItem value="Freelance">Freelance Gigs</SelectItem>
                            <SelectItem value="Internship">Internship</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-foreground mb-3 block">Experience Level</label>
                        <Select defaultValue="Mid">
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Entry">Entry Level</SelectItem>
                            <SelectItem value="Mid">Mid Level</SelectItem>
                            <SelectItem value="Senior">Senior Level</SelectItem>
                            <SelectItem value="Lead">Lead / Executive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </Card>

                  <div className="mt-auto">
                    <Button
                      size="lg"
                      disabled={!resume}
                      className="w-full h-14 text-lg font-bold shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all group"
                      onClick={() => setStep('matching')}
                    >
                      Start Matching
                      <Sparkles className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                    </Button>
                    {!resume && (
                      <p className="text-center text-[10px] text-muted-foreground uppercase tracking-[0.2em] mt-4 font-semibold">
                        Please upload a resume to continue
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (currentIndex >= mockMatches.length) {
    return (
      <main className="min-h-screen bg-background w-full">
        <Navbar />
        <div className="flex gap-8">
          <Sidebar />
          <div className="flex-1 w-full px-6 py-8">
            <div className="w-full max-w-2xl">
              <Card className="p-12 text-center shadow-lg">
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-accent" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold mb-2">You're All Caught Up!</h2>
                <p className="text-muted-foreground mb-8">
                  You've reviewed all AI-matched opportunities. Check back soon for
                  new matches tailored to your profile.
                </p>
                <div className="space-y-4">
                  <p className="text-xl font-bold">
                    You liked {liked.length} opportunity
                    {liked.length !== 1 ? 'ies' : ''}
                  </p>
                  <Button
                    size="lg"
                    className="w-full font-bold"
                    onClick={() => {
                      setCurrentIndex(0)
                      setLiked([])
                      setPassed([])
                      setStep('onboarding')
                    }}
                  >
                    Start Over
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background w-full">
      <Navbar />
      <div className="flex gap-8">
        <Sidebar />
        <div className="flex-1 w-full px-6 py-8">
          <div className="w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-primary/10 rounded-xl">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-1 tracking-tight">AI Job Matcher</h1>
                  <p className="text-muted-foreground">
                    Match {currentIndex + 1} of {mockMatches.length}
                  </p>
                </div>
              </div>
              <Card className="px-4 py-3 flex items-center gap-3 border-accent/20 bg-accent/[0.02]">
                <div className="p-1.5 bg-accent/10 rounded-lg">
                  <Heart className="w-4 h-4 text-accent fill-accent" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Saved</p>
                  <p className="text-xl font-bold text-accent">{liked.length}</p>
                </div>
              </Card>
            </div>

            <div className="w-full">
              {/* Progress Bar */}
              <div className="mb-10">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500 ease-out"
                    style={{
                      width: `${((currentIndex + 1) / mockMatches.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Match Card */}
              <Card className="overflow-hidden shadow-xl border-none mb-10">
                {/* Card Header with Match Score */}
                <div className="bg-gradient-to-br from-primary/[0.08] via-accent/[0.05] to-transparent p-10 lg:p-12 relative">
                  <div className="absolute top-6 right-6 bg-accent text-white px-4 py-2 rounded-full font-bold text-base shadow-lg shadow-accent/20">
                    {currentJob.matchScore}% Match
                  </div>

                  <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">
                    {currentJob.title}
                  </h2>
                  <p className="text-xl md:text-2xl font-medium text-muted-foreground mb-8">
                    {currentJob.company}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="flex items-center gap-2.5 text-foreground">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span className="text-base font-medium">{currentJob.location}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-foreground">
                      <DollarSign className="w-5 h-5 text-primary" />
                      <span className="text-base font-medium">{currentJob.salary}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-foreground">
                      <Users className="w-5 h-5 text-primary" />
                      <span className="text-base font-medium">{currentJob.applicants} applied</span>
                    </div>
                  </div>

                  <Card className="p-5 bg-white/40 backdrop-blur-md border-white/20 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
                      Why it's a good match
                    </p>
                    <p className="text-lg leading-relaxed text-foreground/90 font-medium">
                      {currentJob.reason}
                    </p>
                  </Card>
                </div>

                {/* Skills */}
                <div className="p-10 border-b bg-muted/30">
                  <h3 className="text-sm font-bold mb-5 flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Key Skills Alignment
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {currentJob.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-white text-secondary-foreground border rounded-xl text-sm font-bold shadow-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Match Details */}
                <div className="p-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-muted/20 rounded-2xl border border-border/50">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                        Salary Match
                      </p>
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-accent" />
                        <span className="text-2xl font-bold">96%</span>
                      </div>
                    </div>
                    <div className="p-5 bg-muted/20 rounded-2xl border border-border/50">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                        Experience Match
                      </p>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-accent" />
                        <span className="text-2xl font-bold">94%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handlePass}
                  className="h-16 flex-1 rounded-2xl text-lg font-bold border-2 gap-2"
                >
                  <X className="w-5 h-5" />
                  Pass Opportunity
                </Button>
                <Button
                  size="lg"
                  onClick={handleLike}
                  className="h-16 flex-1 rounded-2xl text-lg font-bold bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20 gap-2"
                >
                  <Heart className="w-5 h-5 fill-white" />
                  Save Match
                </Button>
                <Button variant="outline" size="lg" className="h-16 w-16 rounded-2xl border-2 p-0" asChild>
                  <a href={`/jobs/${currentJob.id}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-6 h-6" />
                  </a>
                </Button>
              </div>

              {/* Info */}
              <div className="mt-10 p-6 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-4">
                <Sparkles className="w-5 h-5 text-primary mt-1 shrink-0" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our AI analyzes 100+ data points to find the best opportunities
                  for you. The more you interact, the more accurate your matches become.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
