'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Navbar from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Building2,
  Briefcase,
  MapPin,
  DollarSign,
  Upload,
  Loader2,
  Lock,
} from 'lucide-react'

export default function MatcherApplyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: '',
    expectedPay: '',
    linkedIn: '',
    coverNote: '',
  })

  const company = searchParams.get('company') || 'Company'
  const role = searchParams.get('title') || 'Role'
  const location = searchParams.get('location') || 'Location not provided'
  const description = searchParams.get('description') || 'No additional description was provided for this role.'

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    setFormData((current) => ({
      ...current,
      fullName: session?.user?.name ?? current.fullName,
      email: session?.user?.email ?? current.email,
      role: role || current.role,
    }))
  }, [role, router, session?.user?.email, session?.user?.name, status])

  if (status === 'loading') {
    return (
      <main className="min-h-screen bg-background w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </main>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <main className="min-h-screen bg-background w-full">
        <Navbar />
        <div className="flex gap-4">
          <Sidebar />
          <div className="flex-1 w-full px-4 py-8 flex items-center justify-center">
            <Card className="p-8 text-center shadow-lg max-w-md w-full">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-bold mb-2">Authentication Required</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Please sign in to fill out the application form.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => router.push('/login')}>
                  Log In
                </Button>
                <Button className="flex-1" onClick={() => router.push('/signup')}>
                  Sign Up
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    )
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const jobId = searchParams.get('jobId')
      if (!jobId) {
        toast.error('Job ID not found')
        setIsSubmitting(false)
        return
      }

      const res = await fetch('/api/jobs/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          fullName: formData.fullName,
          phone: formData.phone,
          role: formData.role,
          expectedPay: formData.expectedPay,
          linkedIn: formData.linkedIn,
          coverNote: formData.coverNote
        })
      })

      const data = await res.json()

      if (res.ok) {
        toast.success('Application submitted successfully!')
        router.push('/matcher')
      } else if (res.status === 409) {
        toast.error('You have already applied to this job')
      } else {
        toast.error(data.error || 'Failed to submit application')
      }
    } catch (error: any) {
      toast.error('Error submitting application')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-background w-full">
      <Navbar />
      <div className="flex gap-4">
        <Sidebar />
        <div className="flex-1 w-full px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <Link href="/matcher">
                <Button variant="outline" className="gap-2 rounded-xl">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Matcher
                </Button>
              </Link>
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="w-4 h-4" />
                Application form
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 max-w-3xl mx-auto">
              <Card className="p-6 md:p-8 shadow-lg rounded-3xl">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-2">
                      Quick application
                    </p>
                    <h1 className="text-3xl font-bold tracking-tight">Apply for this role</h1>
                    <p className="text-muted-foreground mt-2">
                      Fill in your resume and basic details before sending the application.
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Full Name
                      </label>
                      <Input
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Role Applying For
                      </label>
                      <Input
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        placeholder="Software Engineer"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Expected Pay
                      </label>
                      <Input
                        value={formData.expectedPay}
                        onChange={(e) => setFormData({ ...formData, expectedPay: e.target.value })}
                        placeholder="$80k - $100k or hourly rate"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Phone Number
                      </label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 555 123 4567"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        LinkedIn / Portfolio
                      </label>
                      <Input
                        value={formData.linkedIn}
                        onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                        placeholder="https://linkedin.com/in/yourname"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Resume Upload
                    </label>
                    <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Upload className="w-5 h-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">
                            {resumeFile ? resumeFile.name : 'Upload your resume'}
                          </p>
                          <p className="text-xs text-muted-foreground">PDF, DOC, or DOCX up to 5MB</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-xl shrink-0"
                        onClick={() => document.getElementById('application-resume-upload')?.click()}
                      >
                        Choose File
                      </Button>
                    </div>
                    <input
                      id="application-resume-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Short Note
                    </label>
                    <Textarea
                      value={formData.coverNote}
                      onChange={(e) => setFormData({ ...formData, coverNote: e.target.value })}
                      placeholder="Add a short note about why you're a good fit for this role."
                      className="min-h-[130px]"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" className="flex-1 rounded-2xl" onClick={() => router.back()}>
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1 rounded-2xl bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Submit Application'
                      )}
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
