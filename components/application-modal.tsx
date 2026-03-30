'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

interface ApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  jobId: string
  jobTitle: string
  companyName: string
}

export function ApplicationModal({
  isOpen,
  onClose,
  jobId,
  jobTitle,
  companyName,
}: ApplicationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    contactEmail: '',
    contactPhone: '',
    linkedin: '',
    portfolio: '',
    yearsOfExperience: '',
    availability: 'Immediately',
    coverLetter: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          ...formData,
          yearsOfExperience: parseInt(formData.yearsOfExperience) || 0,
          skills: [] // In a real app, get from user profile
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: 'Application Submitted!',
          description: `Your application for ${jobTitle} at ${companyName} has been submitted successfully.`,
        })
        handleClose()
      } else {
        throw new Error(data.error || 'Failed to submit application')
      }
    } catch (error) {
      console.error('Application error:', error)
      toast({
        title: 'Error',
        description: 'Failed to submit application. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({
      contactEmail: '',
      contactPhone: '',
      linkedin: '',
      portfolio: '',
      yearsOfExperience: '',
      availability: 'Immediately',
      coverLetter: ''
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply for {jobTitle}</DialogTitle>
          <DialogDescription>
            {companyName} • Complete your application below
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                />
              </div>
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn Profile</Label>
                <Input
                  id="linkedin"
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="portfolio">Portfolio/Website</Label>
                <Input
                  id="portfolio"
                  type="url"
                  placeholder="https://yourportfolio.com"
                  value={formData.portfolio}
                  onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                />
              </div>
            </div>

            {/* Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience *</Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  max="50"
                  placeholder="5"
                  value={formData.yearsOfExperience}
                  onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availability">Availability *</Label>
                <select
                  id="availability"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                >
                  <option value="Immediately">Immediately</option>
                  <option value="2 weeks">2 weeks</option>
                  <option value="1 month">1 month</option>
                  <option value="2 months">2 months</option>
                  <option value="More than 2 months">More than 2 months</option>
                </select>
              </div>
            </div>

            {/* Cover Letter */}
            <div className="space-y-2">
              <Label htmlFor="coverLetter">Cover Letter</Label>
              <Textarea
                id="coverLetter"
                placeholder={`Tell ${companyName} why you're a great fit for this role...`}
                className="min-h-[150px]"
                value={formData.coverLetter}
                onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
