'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Navbar from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'

import {
  Edit2,
  MapPin,
  Mail,
  Linkedin,
  Github,
  Award,
  Briefcase,
  GraduationCap,
  Star,
  MessageSquare,
  LogOut,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const mockUser = {
  name: 'Alex Johnson',
  title: 'Senior Product Designer',
  location: 'San Francisco, CA',
  bio: 'Passionate about creating intuitive and beautiful digital experiences. Coffee enthusiast and design systems advocate.',
  avatar: '🎨',
  rating: 4.8,
  reviews: 127,
  skills: ['UI Design', 'UX Research', 'Figma', 'Design Systems', 'Prototyping'],
  experience: [
    {
      id: 1,
      title: 'Senior Designer at Tech Corp',
      period: '2021 - Present',
      description: 'Leading design systems and product strategy',
    },
    {
      id: 2,
      title: 'Product Designer at StartupXYZ',
      period: '2019 - 2021',
      description: 'Designed mobile and web applications',
    },
  ],
  education: [
    {
      id: 1,
      school: 'Design School of Arts',
      degree: 'Bachelor of Fine Arts',
      year: '2019',
    },
  ],
  savedJobs: 12,
  applications: 5,
  matches: 3,
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    toast.success('Logged out successfully')
    router.push('/')
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="flex gap-8">
        <Sidebar />
        <div className="flex-1 w-full px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold">My Profile</h1>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="gap-2"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </Button>
              <Button
                variant={isEditing ? 'default' : 'outline'}
                className="gap-2"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit2 className="w-4 h-4" />
                {isEditing ? 'Save' : 'Edit Profile'}
              </Button>
            </div>
          </div>

          {/* Main Profile Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <Card className="p-8">
                <div className="flex gap-6 mb-8">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-primary/10 rounded-full flex items-center justify-center text-6xl md:text-7xl">
                    {mockUser.avatar}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl md:text-4xl font-bold mb-2">
                      {mockUser.name}
                    </h2>
                    <p className="text-xl text-primary font-semibold mb-3">
                      {mockUser.title}
                    </p>
                    <div className="space-y-2 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {mockUser.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {mockUser.rating} ({mockUser.reviews} reviews)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-2">About</h3>
                  <p className="text-foreground leading-relaxed">{mockUser.bio}</p>
                </div>

                {/* Skills */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {mockUser.skills.map((skill, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="cursor-pointer"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="pt-6 border-t">
                  <h3 className="text-lg font-semibold mb-4">Social Links</h3>
                  <div className="flex gap-3">
                    <Button variant="outline" size="icon">
                      <Linkedin className="w-5 h-5" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Github className="w-5 h-5" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Mail className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Stats Sidebar */}
            <div className="space-y-4">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Stats</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Saved Jobs</p>
                    <p className="text-2xl font-bold text-primary">
                      {mockUser.savedJobs}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Applications
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {mockUser.applications}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      AI Matches
                    </p>
                    <p className="text-2xl font-bold text-accent">
                      {mockUser.matches}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <Button className="w-full gap-2 mb-3">
                  <MessageSquare className="w-4 h-4" />
                  Message
                </Button>
                <Button variant="outline" className="w-full">
                  Share Profile
                </Button>
              </Card>
            </div>
          </div>

          {/* Experience Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="p-8 mb-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-primary" />
                  Experience
                </h2>
                <div className="space-y-6">
                  {mockUser.experience.map((exp, idx) => (
                    <div key={exp.id} className="flex gap-4">
                      {idx !== mockUser.experience.length - 1 && (
                        <div className="absolute left-6 w-0.5 h-20 bg-border" />
                      )}
                      <div className="w-3 h-3 rounded-full bg-primary mt-2 flex-shrink-0 relative z-10" />
                      <div>
                        <h3 className="text-lg font-semibold">{exp.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {exp.period}
                        </p>
                        <p className="text-foreground">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Education Section */}
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-primary" />
                  Education
                </h2>
                <div className="space-y-4">
                  {mockUser.education.map((edu) => (
                    <div key={edu.id} className="pb-4 border-b last:border-b-0">
                      <h3 className="text-lg font-semibold">{edu.school}</h3>
                      <p className="text-sm text-muted-foreground">
                        {edu.degree} • {edu.year}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Credentials */}
            <Card className="p-6 h-fit">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Credentials
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <p className="text-sm font-medium text-accent">Verified</p>
                  <p className="text-xs text-muted-foreground">Email confirmed</p>
                </div>
                <div className="p-3 bg-accent/10 rounded-lg">
                  <p className="text-sm font-medium text-accent">Top Rated</p>
                  <p className="text-xs text-muted-foreground">4.8+ rating</p>
                </div>
                <div className="p-3 bg-secondary rounded-lg">
                  <p className="text-sm font-medium text-secondary-foreground">
                    5+ Years
                  </p>
                  <p className="text-xs text-secondary-foreground/70">
                    Industry experience
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
