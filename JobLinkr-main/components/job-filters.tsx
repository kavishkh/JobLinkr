'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown, X } from 'lucide-react'

interface FilterProps {
  onFiltersChange?: (filters: {
    jobType: string[]
    level: string[]
    salary: string
    location: string
  }) => void
}

export function JobFilters({ onFiltersChange }: FilterProps) {
  const [expandedSections, setExpandedSections] = useState({
    jobType: true,
    level: true,
    salary: false,
    location: false,
  })

  const [filters, setFilters] = useState({
    jobType: [] as string[],
    level: [] as string[],
    salary: '' as string,
    location: '' as string,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const toggleJobType = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      jobType: prev.jobType.includes(type)
        ? prev.jobType.filter((t) => t !== type)
        : [...prev.jobType, type],
    }))
  }

  const toggleLevel = (level: string) => {
    setFilters((prev) => ({
      ...prev,
      level: prev.level.includes(level)
        ? prev.level.filter((l) => l !== level)
        : [...prev.level, level],
    }))
  }

  const clearFilters = () => {
    setFilters({
      jobType: [],
      level: [],
      salary: '',
      location: '',
    })
  }

  const jobTypes = [
    { label: 'Full-time', count: 234 },
    { label: 'Part-time', count: 89 },
    { label: 'Contract', count: 156 },
    { label: 'Freelance', count: 342 },
  ]

  const levels = [
    { label: 'Entry Level', count: 145 },
    { label: 'Mid-level', count: 287 },
    { label: 'Senior', count: 198 },
    { label: 'Lead', count: 67 },
  ]

  return (
    <Card className="p-6 h-fit sticky top-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Filters</h3>
        {(filters.jobType.length > 0 ||
          filters.level.length > 0 ||
          filters.salary ||
          filters.location) && (
          <button
            onClick={clearFilters}
            className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {/* Job Type */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('jobType')}
          className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-muted transition-colors"
        >
          <span className="font-medium">Job Type</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              expandedSections.jobType ? 'rotate-180' : ''
            }`}
          />
        </button>
        {expandedSections.jobType && (
          <div className="space-y-2 mt-2 ml-1">
            {jobTypes.map((type) => (
              <label key={type.label} className="flex items-center gap-3 p-2">
                <input
                  type="checkbox"
                  checked={filters.jobType.includes(type.label)}
                  onChange={() => toggleJobType(type.label)}
                  className="w-4 h-4 rounded border-muted accent-primary"
                />
                <span className="text-sm flex-1">{type.label}</span>
                <span className="text-xs text-muted-foreground">
                  {type.count}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Experience Level */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('level')}
          className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-muted transition-colors"
        >
          <span className="font-medium">Experience Level</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              expandedSections.level ? 'rotate-180' : ''
            }`}
          />
        </button>
        {expandedSections.level && (
          <div className="space-y-2 mt-2 ml-1">
            {levels.map((level) => (
              <label key={level.label} className="flex items-center gap-3 p-2">
                <input
                  type="checkbox"
                  checked={filters.level.includes(level.label)}
                  onChange={() => toggleLevel(level.label)}
                  className="w-4 h-4 rounded border-muted accent-primary"
                />
                <span className="text-sm flex-1">{level.label}</span>
                <span className="text-xs text-muted-foreground">
                  {level.count}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Salary Range */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('salary')}
          className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-muted transition-colors"
        >
          <span className="font-medium">Salary Range</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              expandedSections.salary ? 'rotate-180' : ''
            }`}
          />
        </button>
        {expandedSections.salary && (
          <div className="space-y-2 mt-2 ml-1">
            {['$0 - $50K', '$50K - $100K', '$100K - $150K', '$150K+'].map(
              (range) => (
                <label key={range} className="flex items-center gap-3 p-2">
                  <input
                    type="radio"
                    name="salary"
                    checked={filters.salary === range}
                    onChange={() =>
                      setFilters((prev) => ({ ...prev, salary: range }))
                    }
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm">{range}</span>
                </label>
              )
            )}
          </div>
        )}
      </div>

      {/* Location */}
      <div>
        <button
          onClick={() => toggleSection('location')}
          className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-muted transition-colors"
        >
          <span className="font-medium">Location</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              expandedSections.location ? 'rotate-180' : ''
            }`}
          />
        </button>
        {expandedSections.location && (
          <div className="mt-2">
            <input
              type="text"
              placeholder="Search location..."
              value={filters.location}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, location: e.target.value }))
              }
              className="w-full px-3 py-2 rounded-lg border border-input bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            />
          </div>
        )}
      </div>

      {/* Apply Button */}
      <Button className="w-full mt-6">Apply Filters</Button>
    </Card>
  )
}
