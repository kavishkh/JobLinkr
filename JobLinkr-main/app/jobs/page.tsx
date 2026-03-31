'use client'

import { useState } from 'react'
import Navbar from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { JobCard } from '@/components/job-card'
import { JobFilters } from '@/components/job-filters'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { mockJobs } from '@/lib/mockData'
import { Search, MapPin, Briefcase, DollarSign } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function JobsPage() {
  const [filteredJobs, setFilteredJobs] = useState(mockJobs)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

  const applyFilters = (
    search: string = searchTerm,
    level: string | null = selectedLevel,
    type: string | null = selectedType,
    location: string | null = selectedLocation
  ) => {
    let filtered = mockJobs

    if (search.trim()) {
      const lower = search.toLowerCase()
      filtered = filtered.filter(
        job =>
          job.title.toLowerCase().includes(lower) ||
          job.company.toLowerCase().includes(lower) ||
          job.description.toLowerCase().includes(lower) ||
          job.skills.some(s => s.toLowerCase().includes(lower))
      )
    }

    if (level) {
      filtered = filtered.filter(job => job.level === level)
    }

    if (type) {
      filtered = filtered.filter(job => job.type === type)
    }

    if (location) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(location.toLowerCase())
      )
    }

    setFilteredJobs(filtered)
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    applyFilters(value, selectedLevel, selectedType, selectedLocation)
  }

  const handleLevelChange = (value: string) => {
    const newLevel = selectedLevel === value ? null : value
    setSelectedLevel(newLevel)
    applyFilters(searchTerm, newLevel, selectedType, selectedLocation)
  }

  const handleTypeChange = (value: string) => {
    const newType = selectedType === value ? null : value
    setSelectedType(newType)
    applyFilters(searchTerm, selectedLevel, newType, selectedLocation)
  }

  const handleLocationChange = (value: string) => {
    setSelectedLocation(value === 'all' ? null : value)
    applyFilters(searchTerm, selectedLevel, selectedType, value === 'all' ? null : value)
  }

  const handleReset = () => {
    setSearchTerm('')
    setSelectedLevel(null)
    setSelectedType(null)
    setSelectedLocation(null)
    setFilteredJobs(mockJobs)
  }

  const locations = Array.from(new Set(mockJobs.map(j => j.location))).filter(l => l !== 'Remote')
  const hasActiveFilters = searchTerm || selectedLevel || selectedType || selectedLocation

  return (
    <main className="min-h-screen bg-background w-full">
      <Navbar />

      <div className="flex gap-8">
        <Sidebar />
        <div className="flex-1 w-full px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Browse Jobs</h1>
            <p className="text-muted-foreground">Find your next opportunity</p>
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
                      onChange={(e) => handleSearch(e.target.value)}
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
                        onClick={() => handleLevelChange(level)}
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
                >
                  Reset Filters
                </Button>
              </Card>
            </div>

            {/* Main Content - Job List */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 gap-4">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map(job => (
                    <JobCard key={job.id} job={job} />
                  ))
                ) : (
                  <Card className="p-12 text-center">
                    <p className="text-muted-foreground">No jobs found matching your criteria.</p>
                    <Button
                      variant="link"
                      onClick={handleReset}
                      className="mt-2"
                    >
                      Clear all filters
                    </Button>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
