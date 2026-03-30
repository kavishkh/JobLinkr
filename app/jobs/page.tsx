'use client'

import { useState, useEffect, useCallback } from 'react'
import Navbar from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { JobCard } from '@/components/job-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Search, RefreshCw, Clock, MapPin, Briefcase } from 'lucide-react'
import { ApplicationModal } from '@/components/application-modal'
import { useToast } from '@/hooks/use-toast'

interface Job {
  id: string
  title: string
  company: string
  companyLogo: string
  location: string
  level: 'Entry' | 'Mid' | 'Senior'
  type: 'Full-time' | 'Contract' | 'Freelance'
  salary?: { min: number; max: number; currency: string }
  description: string
  skills: string[]
  posted: string
  applicants?: number
  source?: string
}

export default function JobsPage() {
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false)
  const { toast } = useToast()

  // Fetch jobs from API
  const fetchJobs = useCallback(async (showLoading = false) => {
    if (showLoading) setIsLoading(true)
    if (isRefreshing) setIsRefreshing(true)

    try {
      const params = new URLSearchParams()
      if (searchTerm) params.set('q', searchTerm)
      if (selectedLevel) params.set('level', selectedLevel)
      if (selectedType) params.set('type', selectedType)
      if (selectedLocation && selectedLocation !== 'all') params.set('location', selectedLocation)
      params.set('limit', '50')

      const response = await fetch(`/api/jobs/search?${params.toString()}`)
      const data = await response.json()

      if (response.ok) {
        setFilteredJobs(data.jobs || [])
        setLastUpdated(new Date())
        
        if (!showLoading && isRefreshing) {
          toast({
            title: 'Jobs Updated',
            description: `Found ${data.total} jobs`,
            duration: 2000,
          })
        }
      } else {
        throw new Error('Failed to fetch jobs')
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
      toast({
        title: 'Error',
        description: 'Failed to load jobs. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [searchTerm, selectedLevel, selectedType, selectedLocation, isRefreshing, toast])

  // Initial fetch
  useEffect(() => {
    fetchJobs(true)
  }, [])

  // Auto-refresh every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchJobs()
    }, 120000) // 2 minutes

    return () => clearInterval(interval)
  }, [fetchJobs])

  const applyFilters = async (
    search: string = searchTerm,
    level: string | null = selectedLevel,
    type: string | null = selectedType,
    location: string | null = selectedLocation
  ) => {
    setSearchTerm(search)
    setSelectedLevel(level)
    setSelectedType(type)
    setSelectedLocation(location)
    
    // Filters will be applied automatically by the useEffect dependency on fetchJobs
  }

  const handleRefresh = () => {
    fetchJobs()
  }

  const handleReset = () => {
    setSearchTerm('')
    setSelectedLevel(null)
    setSelectedType(null)
    setSelectedLocation(null)
    setFilteredJobs([])
    setTimeout(() => fetchJobs(true), 100)
  }

  const handleApplyClick = (job: Job) => {
    setSelectedJob(job)
    setIsApplicationModalOpen(true)
  }

  const locations = Array.from(new Set(filteredJobs.map(j => j.location))).filter(l => l !== 'Remote')
  const hasActiveFilters = searchTerm || selectedLevel || selectedType || selectedLocation

  return (
    <main className="min-h-screen bg-background w-full">
      <Navbar />

      <div className="flex gap-8">
        <Sidebar />
        <div className="flex-1 w-full px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-4xl font-bold">Browse Jobs</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="ml-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
            <p className="text-muted-foreground">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
              {hasActiveFilters && ' matching your criteria'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Filters */}
            <div className="lg:col-span-1">
              <Card className="p-6 border border-border sticky top-20">
                <h3 className="font-semibold text-lg mb-4 text-foreground">Filters</h3>

                {/* Search in filters */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Title, skill, company..."
                      value={searchTerm}
                      onChange={(e) => applyFilters(e.target.value, selectedLevel, selectedType, selectedLocation)}
                      className="pl-8"
                    />
                  </div>
                </div>

                {/* Level Filter */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Experience Level
                  </label>
                  <div className="space-y-2">
                    {['Entry', 'Mid', 'Senior'].map(level => (
                      <button
                        key={level}
                        onClick={() => applyFilters(searchTerm, selectedLevel === level ? null : level, selectedType, selectedLocation)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${selectedLevel === level
                          ? 'bg-primary text-white'
                          : 'bg-muted hover:bg-accent/20 text-foreground'
                          }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={handleReset}
                  disabled={!hasActiveFilters}
                >
                  Reset Filters
                </Button>
              </Card>
            </div>

            {/* Main Content - Job List */}
            <div className="lg:col-span-3">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Card key={i} className="p-6 animate-pulse">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-muted rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-5 bg-muted rounded w-3/4"></div>
                          <div className="h-4 bg-muted rounded w-1/2"></div>
                          <div className="h-4 bg-muted rounded w-full"></div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : filteredJobs.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {filteredJobs.map(job => (
                    <JobCard 
                      key={job.id} 
                      job={job} 
                      onApply={() => handleApplyClick(job)}
                    />
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground mb-4">No jobs found matching your criteria.</p>
                  <Button
                    variant="link"
                    onClick={handleReset}
                  >
                    Clear all filters
                  </Button>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {selectedJob && (
        <ApplicationModal
          isOpen={isApplicationModalOpen}
          onClose={() => setIsApplicationModalOpen(false)}
          jobId={selectedJob.id}
          jobTitle={selectedJob.title}
          companyName={selectedJob.company}
        />
      )}
    </main>
  )
}
