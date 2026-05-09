'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Plus,
  Users,
  Eye,
  MessageSquare,
  TrendingUp,
  Calendar,
  DollarSign,
  BarChart3,
  CheckCircle,
  Clock,
  XCircle,
  Building2,
  Loader2,
  ArrowRight,
  Info
} from 'lucide-react'
import Navbar from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

const mockCompanyJobs = [
  {
    id: '1',
    title: 'Senior Product Designer',
    posted: '2 weeks ago',
    views: 1250,
    applications: 34,
    status: 'active',
  },
  {
    id: '2',
    title: 'Full Stack Engineer',
    posted: '1 week ago',
    views: 890,
    applications: 28,
    status: 'active',
  },
  {
    id: '3',
    title: 'Marketing Manager',
    posted: '3 weeks ago',
    views: 650,
    applications: 15,
    status: 'closed',
  },
]

const mockApplications = [
  {
    id: '1',
    name: 'Sarah Chen',
    position: 'Senior Product Designer',
    status: 'reviewing',
    date: '2 hours ago',
    rating: 4.9,
  },
  {
    id: '2',
    name: 'Mike Rodriguez',
    position: 'Full Stack Engineer',
    status: 'interviewed',
    date: '1 day ago',
    rating: 4.7,
  },
  {
    id: '3',
    name: 'Emma Wilson',
    position: 'Senior Product Designer',
    status: 'rejected',
    date: '3 days ago',
    rating: 3.8,
  },
]

const stats = [
  {
    label: 'Active Jobs',
    value: '2',
    icon: TrendingUp,
    color: 'text-primary',
  },
  {
    label: 'Total Applications',
    value: '77',
    icon: Users,
    color: 'text-accent',
  },
  {
    label: 'Profile Views',
    value: '2.7K',
    icon: Eye,
    color: 'text-secondary-foreground',
  },
  {
    label: 'Hired This Month',
    value: '3',
    icon: CheckCircle,
    color: 'text-accent',
  },
]

export default function EmployerDashboard() {
  const { data: session, status } = useSession()
  const [selectedTab, setSelectedTab] = useState('jobs')
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Company Info Form State
  const [companyName, setCompanyName] = useState('')
  const [industry, setIndustry] = useState('')
  const [companySize, setCompanySize] = useState('')
  const [website, setWebsite] = useState('')

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfile()
    } else if (status === 'unauthenticated') {
      setLoading(false)
    }
  }, [status])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/user/profile')
      const data = await res.json()
      if (res.ok) {
        setUserProfile(data)
        if (data.companyName) {
          setCompanyName(data.companyName)
          setIndustry(data.industry || '')
          setCompanySize(data.companySize || '')
          setWebsite(data.website || '')
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          industry,
          companySize,
          website,
        }),
      })

      if (res.ok) {
        toast.success('Company profile updated successfully!')
        fetchProfile()
      } else {
        toast.error('Failed to update company profile')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  const role = session?.user?.role || userProfile?.role
  if (role?.toLowerCase() === 'seeker') {
    return (
      <main className="min-h-screen bg-background w-full">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Card className="p-8 max-w-md text-center">
            <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-6">
              The Employer Hub is only available for employer accounts.
            </p>
            <Button asChild>
              <a href="/">Return Home</a>
            </Button>
          </Card>
        </div>
      </main>
    )
  }

  const isProfileIncomplete = !userProfile?.companyName

  return (
    <main className="min-h-screen bg-background w-full">
      <Navbar />
      <div className="flex gap-8">
        <Sidebar />
        <div className="flex-1 w-full px-6 py-8">
          {isProfileIncomplete ? (
            <div className="max-w-3xl mx-auto">
              <div className="mb-10 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
                  <Building2 className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-4xl font-bold mb-3">Set Up Your Employer Hub</h1>
                <p className="text-muted-foreground text-lg">
                  To start posting jobs and finding talent, we need a few details about your company.
                </p>
              </div>

              <Card className="p-8 shadow-premium border-white/10 glass">
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="companyName" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Company Name</Label>
                      <Input
                        id="companyName"
                        placeholder="e.g. TechCorp Inc."
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                        className="h-12 bg-secondary/50 border-none rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Industry</Label>
                      <Input
                        id="industry"
                        placeholder="e.g. Technology, Healthcare"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        required
                        className="h-12 bg-secondary/50 border-none rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companySize" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Company Size</Label>
                      <Input
                        id="companySize"
                        placeholder="e.g. 50-200 employees"
                        value={companySize}
                        onChange={(e) => setCompanySize(e.target.value)}
                        required
                        className="h-12 bg-secondary/50 border-none rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Website URL</Label>
                      <Input
                        id="website"
                        placeholder="https://example.com"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="h-12 bg-secondary/50 border-none rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-xl"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          Complete Setup
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Card>

              <div className="mt-8 flex items-start gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your company information will be displayed on your job postings to help candidates learn more about your organization. You can update these details later in settings.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-4xl font-bold mb-2">Employer Dashboard</h1>
                  <p className="text-muted-foreground">
                    Manage your job postings and find great talent for {userProfile?.companyName}
                  </p>
                </div>
                <Button className="gap-2">
                  <Plus className="w-5 h-5" />
                  Post a Job
                </Button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon
                  return (
                    <Card key={idx} className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {stat.label}
                          </p>
                          <p className="text-3xl font-bold">{stat.value}</p>
                        </div>
                        <Icon className={`w-8 h-8 ${stat.color}`} />
                      </div>
                    </Card>
                  )
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  {/* Tabs */}
                  <div className="flex gap-2 mb-6 border-b">
                    <button
                      onClick={() => setSelectedTab('jobs')}
                      className={`px-4 py-3 font-medium border-b-2 transition-colors ${selectedTab === 'jobs'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                      My Jobs
                    </button>
                    <button
                      onClick={() => setSelectedTab('applications')}
                      className={`px-4 py-3 font-medium border-b-2 transition-colors ${selectedTab === 'applications'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                      Applications
                    </button>
                  </div>

                  {/* Jobs List */}
                  {selectedTab === 'jobs' && (
                    <div className="space-y-4">
                      {mockCompanyJobs.map((job) => (
                        <Card
                          key={job.id}
                          className="p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex-1">
                              <div className="flex items-start gap-3 mb-3">
                                <h3 className="text-lg font-semibold">
                                  {job.title}
                                </h3>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${job.status === 'active'
                                    ? 'bg-accent/20 text-accent'
                                    : 'bg-muted text-muted-foreground'
                                    }`}
                                >
                                  {job.status === 'active' ? 'Active' : 'Closed'}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {job.posted}
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </div>

                          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">
                                Views
                              </p>
                              <p className="text-xl font-semibold flex items-center gap-2">
                                <Eye className="w-4 h-4 text-primary" />
                                {job.views}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">
                                Applications
                              </p>
                              <p className="text-xl font-semibold flex items-center gap-2">
                                <Users className="w-4 h-4 text-accent" />
                                {job.applications}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">
                                Best Match
                              </p>
                              <p className="text-xl font-semibold flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-secondary-foreground" />
                                94%
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Applications List */}
                  {selectedTab === 'applications' && (
                    <div className="space-y-4">
                      {mockApplications.map((app) => (
                        <Card key={app.id} className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold mb-1">
                                {app.name}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-3">
                                Applied for: {app.position}
                              </p>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="text-muted-foreground">
                                  {app.date}
                                </span>
                                <span className="text-yellow-500">
                                  ★ {app.rating}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="mb-3">
                                {app.status === 'reviewing' && (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                    <Clock className="w-3 h-3" />
                                    Reviewing
                                  </span>
                                )}
                                {app.status === 'interviewed' && (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent/20 text-accent rounded-full text-xs font-medium">
                                    <CheckCircle className="w-3 h-3" />
                                    Interviewed
                                  </span>
                                )}
                                {app.status === 'rejected' && (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                    <XCircle className="w-3 h-3" />
                                    Rejected
                                  </span>
                                )}
                              </div>
                              <Button size="sm" variant="outline">
                                <MessageSquare className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                {/* Content Sidebar */}
                <div className="space-y-4">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Company Info</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Company Name
                        </p>
                        <p className="font-medium">{userProfile?.companyName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Industry
                        </p>
                        <p className="font-medium">{userProfile?.industry}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Company Size
                        </p>
                        <p className="font-medium">{userProfile?.companySize}</p>
                      </div>
                      {userProfile?.website && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Website
                          </p>
                          <a href={userProfile.website} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline truncate block">
                            {userProfile.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </Card>

                  <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                    <h3 className="text-lg font-semibold mb-2">Premium Features</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get featured job listings and advanced analytics
                    </p>
                    <Button className="w-full" variant="default">
                      Upgrade to Premium
                    </Button>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      Upcoming
                    </h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium">Interview scheduled</p>
                        <p className="text-xs text-muted-foreground">
                          Tomorrow at 2 PM
                        </p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium">Job expiring soon</p>
                        <p className="text-xs text-muted-foreground">In 5 days</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </main>
  )
}
