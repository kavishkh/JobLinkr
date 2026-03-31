'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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
  Loader2,
  Settings2,
  Globe,
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
import { toast } from 'sonner'

interface MarketJob {
  slug: string
  title: string
  company_name: string
  location: string
  description: string
  url: string
  tags: string[]
  published_at: string
}

interface MatchResult {
  job: {
    id: string
    title: string
    company: string
    location: string
    url: string
    description: string
    skills: string[]
  }
  score: number
  reason: string
  hireabilityTip?: string
}

export default function MatcherPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [liked, setLiked] = useState<string[]>([])
  const [passed, setPassed] = useState<string[]>([])
  const [step, setStep] = useState<'onboarding' | 'matching'>('onboarding')
  const [status, setStatus] = useState<string>('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [resume, setResume] = useState<File | null>(null)
  const [targetRole, setTargetRole] = useState('')
  const [jobType, setJobType] = useState<string>('Full-time')
  const [experienceLevel, setExperienceLevel] = useState<string>('Mid')
  const [matches, setMatches] = useState<MatchResult[]>([])
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)

  const currentMatch = matches[currentIndex]
  const currentJob = currentMatch?.job
  
  const isLiked = currentJob ? liked.includes(currentJob.id) : false
  const isPassed = currentJob ? passed.includes(currentJob.id) : false

  const handleLike = () => {
    if (currentJob && !isLiked) {
      setLiked([...liked, currentJob.id])
      toast.success('Job saved to your matches!')
    }
    handleNext()
  }

  const handlePass = () => {
    if (currentJob && !isPassed) {
      setPassed([...passed, currentJob.id])
    }
    handleNext()
  }

  const handleNext = () => {
    if (currentIndex < matches.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setCurrentIndex(matches.length)
    }
  }

  const startMatching = async () => {
    if (!resume || !targetRole) {
      toast.error('Please upload a resume and specify a target role')
      return
    }

    setIsAnalyzing(true)
    setStatus('Analyzing resume with AI...')

    try {
      // 1. Simulate reading resume text (in a real app, use a PDF parser)
      const fakeResumeText = `Resume for applicant looking for ${targetRole}. Skills include React, TypeScript, and modern web development.`
      
      // 2. Call AI Analysis Route
      const analysisResponse = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: fakeResumeText, targetRole })
      })
      
      const analysisData = await analysisResponse.json()
      setAiAnalysis(analysisData)

      // 3. Search Real-time Market
      setStatus('Searching the live job market...')
      let searchTerms = analysisData.searchKeywords?.join(' ') || targetRole
      if (jobType === 'Remote') searchTerms += ' remote'
      if (jobType === 'Internship') searchTerms += ' internship'
      
      const searchResponse = await fetch(`/api/jobs/search?q=${encodeURIComponent(searchTerms)}&_t=${Date.now()}`)
      const searchData = await searchResponse.json()

      if (!searchData.data || searchData.data.length === 0) {
        toast.info('No direct matches found. Showing similar roles.')
      }

      // 4. Deep Scoring & De-duplication (Sequential to avoid 429)
      setStatus('AI Ranking best opportunities...')
      const seenSlugs = new Set();
      const rawJobs = (searchData.data || []).slice(0, 10); // Take top 10 from market
      const finalMatches: MatchResult[] = [];

      for (const job of rawJobs) {
        if (seenSlugs.has(job.slug)) continue;
        seenSlugs.add(job.slug);

        try {
          // 4s delay to strictly respect 15RPM (1 req / 4s) free tier limit
          if (finalMatches.length > 0) {
            setStatus(`Analyzing match ${finalMatches.length + 1}...`);
            await new Promise(resolve => setTimeout(resolve, 4000));
          }

          const scoreResp = await fetch('/api/jobs/score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              resumeText: fakeResumeText,
              jobTitle: job.title,
              jobDescription: job.description
            })
          })
          
          if (scoreResp.status === 429) {
            console.warn('Rate limit hit, skipping deep score for this job');
            continue;
          }

          const scoreData = await scoreResp.json()

          finalMatches.push({
            job: {
              id: job.slug,
              title: job.title,
              company: job.company_name,
              location: job.location,
              url: job.url,
              description: job.description,
              skills: job.tags || []
            },
            score: scoreData.score || 70,
            reason: scoreData.hireabilityReason,
            hireabilityTip: scoreData.actionTip
          });

          // Only deep-score top 5 to stay safe and fast
          if (finalMatches.length >= 5) break;
          
          setStatus(`Ranked ${finalMatches.length} / 5 matches...`);
        } catch (e) {
          console.error('Scoring error:', e);
        }
      }
      
      if (finalMatches.length === 0) {
         throw new Error('No jobs found')
      }

      setMatches(finalMatches.sort((a,b) => b.score - a.score))
      setStep('matching')
      setCurrentIndex(0)
    } catch (error) {
      console.error(error)
      toast.error('Market search failed. Please try again or check your API key.')
    } finally {
      setIsAnalyzing(false)
      setStatus('')
    }
  }

  const handleEditPreferences = () => {
    setStep('onboarding')
  }

  if (step === 'onboarding') {
    return (
      <main className="min-h-screen bg-background text-foreground w-full">
        <Navbar />
        <div className="flex gap-4">
          <Sidebar />
          <div className="flex-1 w-full px-4 py-6">
            <div className="max-w-3xl mx-auto">
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold mb-1 tracking-tight">AI Market Matcher</h1>
                <p className="text-xs text-muted-foreground">Find real-time opportunities in seconds.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card
                  className={`relative p-8 border-2 border-dashed transition-all cursor-pointer group hover:border-primary/40 hover:bg-primary/[0.01] ${resume ? 'border-primary bg-primary/[0.01]' : 'border-border'}`}
                  onClick={() => document.getElementById('resume-upload')?.click()}
                >
                  <input
                    id="resume-upload"
                    type="file"
                    className="hidden"
                    onChange={(e) => setResume(e.target.files?.[0] || null)}
                  />
                  <div className="flex flex-col items-center justify-center text-center">
                    {resume ? (
                      <>
                        <FileText className="w-8 h-8 text-primary mb-2" />
                        <h3 className="text-sm font-bold truncate max-w-full">{resume.name}</h3>
                        <Button variant="ghost" size="sm" className="mt-2 text-[10px] h-6 px-2" onClick={(e) => { e.stopPropagation(); setResume(null); }}>Change</Button>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary mb-2 transition-transform group-hover:-translate-y-1" />
                        <h3 className="text-sm font-bold">Upload Resume</h3>
                        <p className="text-[10px] text-muted-foreground">PDF, DOCX (Max 5MB)</p>
                      </>
                    )}
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Target Role</label>
                      <Input 
                        placeholder="e.g. Frontend dev" 
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        className="h-9 text-sm bg-muted/50"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Job Type</label>
                      <Select value={jobType} onValueChange={setJobType}>
                        <SelectTrigger className="h-9 text-sm bg-muted/50">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Remote">Remote Only</SelectItem>
                          <SelectItem value="Internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      size="sm"
                      disabled={!resume || !targetRole || isAnalyzing}
                      className="w-full h-10 text-sm font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/10 transition-all"
                      onClick={startMatching}
                    >
                      {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Start Market Search"}
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (currentIndex >= matches.length) {
    return (
      <main className="min-h-screen bg-background w-full">
        <Navbar />
        <div className="flex gap-4">
          <Sidebar />
          <div className="flex-1 w-full px-4 py-8 flex items-center justify-center">
            <Card className="p-8 text-center shadow-lg max-w-sm w-full">
              <CheckCircle className="w-10 h-10 text-accent mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-1">That's All!</h2>
              <p className="text-xs text-muted-foreground mb-6">Reviewed all items for "{targetRole}"</p>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="flex-1" onClick={handleEditPreferences}>Refine</Button>
                <Button size="sm" className="flex-1" onClick={() => { setStep('onboarding'); setLiked([]); setMatches([]); }}>Reset</Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background w-full">
      <Navbar />
      <div className="flex gap-4">
        <Sidebar />
        <div className="flex-1 w-full px-4 py-8">
          <div className="w-full max-w-xl mx-auto">
            {/* Elegant Header */}
            <div className="flex items-center justify-between mb-6 px-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight">AI Matching</h1>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                    Profile Match • {currentIndex + 1} of {matches.length}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 bg-accent/5 rounded-xl border border-accent/10 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-accent fill-accent" />
                  <span className="text-sm font-bold text-accent">{liked.length}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl" onClick={handleEditPreferences}>
                  <Settings2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Premium Match Card - Added key for re-render */}
            <Card key={currentJob?.id || currentIndex} className="overflow-hidden shadow-2xl border-none mb-8 group bg-card animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="relative">
                {/* Score Badge */}
                <div className="absolute top-4 right-4 z-10 transition-transform group-hover:scale-105">
                   <div className="bg-accent text-white px-3 py-1.5 rounded-xl font-bold text-xs shadow-xl shadow-accent/20">
                     {currentMatch.score}% Match
                   </div>
                </div>

                {/* Card Content */}
                <div className="p-8 pt-10 bg-gradient-to-b from-primary/[0.03] via-transparent to-transparent">
                  <div className="flex items-center gap-2 mb-3 opacity-70">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Live Market Opportunity</span>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {currentJob.title}
                  </h2>
                  <p className="text-lg font-semibold text-muted-foreground mb-6">
                    {currentJob.company}
                  </p>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6">
                    <div className="flex items-center gap-2 text-foreground/80">
                      <MapPin className="w-4 h-4 text-primary/70" />
                      <span className="text-xs font-medium">{currentJob.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground/80">
                      <Globe className="w-4 h-4 text-primary/70" />
                      <span className="text-xs font-medium uppercase">{jobType}</span>
                    </div>
                  </div>

                  <div className="p-5 bg-muted/30 rounded-2xl border border-border/40 mb-2 shadow-inner">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary/80 mb-2">AI Match Insight</p>
                    <p className="text-sm leading-relaxed text-foreground/90 font-medium italic">
                      " {currentMatch.reason} "
                    </p>
                  </div>

                  {/* New Hireability Tip Section */}
                  <div className="p-4 mb-6 bg-accent/5 rounded-xl border border-accent/10 flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-0.5">How to get hired</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {currentMatch.hireabilityTip || "Apply early and highlight your core technical skills."}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {currentJob.skills.slice(0, 6).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-white/50 text-[10px] font-bold border rounded-lg shadow-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Action Group - Prioritize Apply */}
            <div className="flex flex-col gap-3 max-w-md mx-auto">
              <Button
                asChild
                size="lg"
                className="w-full rounded-2xl h-14 font-bold text-base bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all gap-2"
              >
                <a href={currentJob.url} target="_blank" rel="noopener noreferrer">
                  Apply Now on Company Site
                  <ExternalLink className="w-5 h-5" />
                </a>
              </Button>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handlePass}
                  className="flex-1 rounded-2xl h-14 font-bold text-sm hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30 transition-all border-2"
                >
                  <X className="w-5 h-5 mr-2" />
                  Skip
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleLike}
                  className="flex-1 rounded-2xl h-14 font-bold text-sm border-2 transition-all gap-2"
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-accent text-accent' : ''}`} />
                  Save for Later
                </Button>
              </div>
            </div>

            <p className="text-center text-[10px] text-muted-foreground uppercase mt-8 opacity-40 tracking-widest font-bold">
              AI Market Matcher • Refine Search in Settings
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
