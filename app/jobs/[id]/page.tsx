'use client'

import { useState } from 'react'
import Link from 'next/link'
import { mockJobs, mockApplications } from '@/lib/mockData'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Briefcase,
  Heart,
  Share2,
  Calendar,
  Users,
  CheckCircle,
} from 'lucide-react'
import Navbar from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'

export default function JobDetail({ params }: { params: { id: string } }) {
  const job = mockJobs.find((j) => j.id === params.id)
  const [isSaved, setIsSaved] = useState(false)
  const [isApplied, setIsApplied] = useState(
    mockApplications.some((app) => app.jobId === params.id)
  )

  if (!job) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex gap-8">
          <Sidebar />
          <div className="flex-1 w-full px-6 py-8">
            <Link href="/jobs">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Jobs
              </Button>
            </Link>
            <div className="mt-8 text-center">
              <p className="text-lg text-muted-foreground">Job not found</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="flex gap-8">
        <Sidebar />
        <div className="flex-1 container py-6 md:py-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-8">
            <Link href="/jobs">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <div className="flex gap-2">
              <Button
                variant={isSaved ? 'default' : 'outline'}
                size="icon"
                onClick={() => setIsSaved(!isSaved)}
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Job Header */}
              <Card className="mb-6 p-6 md:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                      {job.title}
                    </h1>
                    <p className="text-lg text-muted-foreground mb-4">
                      {job.company}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="w-4 h-4" />
                        {job.salary ? `${job.salary.currency}${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}` : 'Competitive'}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {job.type}
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => setIsApplied(!isApplied)}
                  variant={isApplied ? 'outline' : 'default'}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Application Sent
                    </>
                  ) : (
                    'Apply Now'
                  )}
                </Button>
              </Card>

              {/* Job Description */}
              <Card className="mb-6 p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-4">About This Role</h2>
                <div className="prose prose-sm max-w-none text-foreground">
                  <p className="mb-4 text-base leading-relaxed">
                    We are looking for a talented {job.title} to join our growing
                    team at {job.company}. This is an exciting opportunity to
                    work on innovative projects and grow your career with a
                    forward-thinking organization.
                  </p>
                  <h3 className="text-xl font-semibold mt-6 mb-3">
                    Key Responsibilities
                  </h3>
                  <ul className="space-y-2 mb-4">
                    <li className="flex gap-3">
                      <span className="text-primary font-bold">•</span>
                      <span>
                        Lead development of cutting-edge features and
                        improvements
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold">•</span>
                      <span>
                        Collaborate with cross-functional teams to deliver
                        excellence
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold">•</span>
                      <span>Mentor junior team members and share knowledge</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold">•</span>
                      <span>Drive technical strategy and best practices</span>
                    </li>
                  </ul>
                </div>
              </Card>

              {/* Requirements */}
              <Card className="p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-4">Requirements</h2>
                <div className="space-y-3">
                  {job.skills.map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-foreground">{skill}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Company Card */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  About {job.company}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {job.company} is a leading technology company known for
                  innovation and excellence in the industry.
                </p>
                <Button variant="outline" className="w-full">
                  Visit Company
                </Button>
              </Card>

              {/* Job Stats */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Job Info</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Posted</p>
                    <p className="font-medium">{job.posted.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Job Type
                    </p>
                    <p className="font-medium">{job.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Level</p>
                    <p className="font-medium">{job.level}</p>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {job.applicants ?? (Math.floor(Math.random() * 50) + 10)} applicants
                    </div>
                  </div>
                </div>
              </Card>

              {/* Similar Jobs */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Similar Jobs</h3>
                <div className="space-y-3">
                  {mockJobs
                    .filter(
                      (j) => j.id !== job.id
                    )
                    .slice(0, 2)
                    .map((j) => (
                      <Link
                        key={j.id}
                        href={`/jobs/${j.id}`}
                        className="block p-3 rounded-lg hover:bg-muted transition-colors group"
                      >
                        <p className="font-medium text-sm group-hover:text-primary transition-colors">
                          {j.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {j.company}
                        </p>
                      </Link>
                    ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
