'use client'

import { useState } from 'react'
import Navbar from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { JobCard } from '@/components/job-card'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { mockJobs } from '@/lib/mockData'
import { BookmarkIcon } from 'lucide-react'

export default function SavedJobsPage() {
    // Use a subset of mockJobs to simulate saved jobs
    const [savedJobs, setSavedJobs] = useState(mockJobs.slice(0, 3))

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
                                {savedJobs.map(job => (
                                    <JobCard key={job.id} job={job} />
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
