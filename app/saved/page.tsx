'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import Navbar from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Job } from '@/lib/mockData'
import { mockJobs } from '@/lib/mockData'
import { BookmarkIcon, Loader2, ExternalLink, Building2, MapPin } from 'lucide-react'
import { useSavedJobs } from '@/hooks/use-saved-jobs'

type SavedJobView = {
    job: Job
    source: 'market' | 'catalog'
    hasCatalogDetails: boolean
    externalUrl?: string
}

function titleFromId(id: string) {
    return id
        .replace(/[-_]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/\b\w/g, (char) => char.toUpperCase()) || 'Saved Market Opportunity'
}

function buildApplyLink(job: Job) {
    return `/matcher/apply?jobId=${encodeURIComponent(job.id)}&title=${encodeURIComponent(job.title)}&company=${encodeURIComponent(job.company)}&location=${encodeURIComponent(job.location)}&description=${encodeURIComponent(job.description)}`
}

export default function SavedJobsPage() {
    const { savedJobs: savedEntries } = useSavedJobs()
    const [savedJobs, setSavedJobs] = useState<SavedJobView[]>([])
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (mounted) {
            const jobs = savedEntries
                .map((entry) => {
                    const source = entry.source || 'market'
                    const catalogJob = mockJobs.find((job) => job.id === entry.id)
                    if (source === 'catalog' && catalogJob) {
                        return {
                            job: catalogJob,
                            source: 'catalog' as const,
                            hasCatalogDetails: true,
                        }
                    }

                    const fallbackTitle = entry.title || titleFromId(entry.id)
                    const fallbackCompany = entry.company || 'Unknown Company'

                    return {
                        source,
                        hasCatalogDetails: false,
                        externalUrl: entry.url,
                        job: {
                            id: entry.id,
                            title: fallbackTitle,
                            company: fallbackCompany,
                            companyLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(fallbackCompany),
                            location: entry.location || 'Remote',
                            level: 'Mid',
                            type: 'Full-time',
                            description: entry.description || 'Saved from AI Market Matcher.',
                            skills: entry.skills || [],
                            posted: new Date(entry.savedAt || Date.now()),
                            applicants: undefined,
                        } as Job,
                    }
                })
                .filter((job): job is SavedJobView => Boolean(job))

            setSavedJobs(jobs)
        }
    }, [savedEntries, mounted])

    if (!mounted) {
        return (
            <main className="min-h-screen bg-background w-full">
                <Navbar />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
                    {/* Header */}
                    <div className="mb-8 flex items-center gap-3">
                        <div className="p-3 bg-primary/10 rounded-xl">
                            <BookmarkIcon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold mb-2">Saved Jobs</h1>
                            <p className="text-muted-foreground">Manage and review your bookmarked opportunities</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
                        {savedJobs.length > 0 ? (
                            <div className="space-y-4">
                                {savedJobs.map((item) => (
                                    <Card key={item.job.id} className="p-6 border-border/50">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Building2 className="w-4 h-4 text-primary/70" />
                                                    <span className="text-sm text-muted-foreground">
                                                        {item.source === 'catalog' ? 'Saved from Jobs' : 'Saved from AI Matcher'}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-bold mb-1 leading-tight">{item.job.title}</h3>
                                                <p className="text-muted-foreground font-medium mb-3">{item.job.company}</p>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{item.job.location}</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground line-clamp-2">{item.job.description}</p>
                                            </div>
                                            <div className="flex flex-col gap-2 shrink-0">
                                                <Link href={buildApplyLink(item.job)}>
                                                    <Button className="w-full">
                                                        Apply Now
                                                    </Button>
                                                </Link>
                                                {item.hasCatalogDetails ? (
                                                    <Link href={`/jobs/${encodeURIComponent(item.job.id)}`}>
                                                        <Button variant="outline" className="w-full">
                                                            View Details
                                                        </Button>
                                                    </Link>
                                                ) : item.externalUrl ? (
                                                    <a href={item.externalUrl} target="_blank" rel="noreferrer">
                                                        <Button variant="outline" className="gap-2 w-full">
                                                            Open Listing
                                                            <ExternalLink className="w-4 h-4" />
                                                        </Button>
                                                    </a>
                                                ) : null}
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                    <BookmarkIcon className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-foreground">No saved jobs yet</h3>
                                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                                    You haven't saved any jobs yet. When you find an interesting opportunity, click the bookmark icon to save it for later.
                                </p>
                                <Button asChild>
                                    <a href="/jobs">Browse Jobs</a>
                                </Button>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}
