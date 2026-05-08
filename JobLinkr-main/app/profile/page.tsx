'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Navbar from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { signOut, useSession } from 'next-auth/react'
import { toast } from 'sonner'

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
  Lock,
  Loader2,
  Globe,
  Twitter,
  Plus,
  Trash2,
  X,
  Check,
  Zap,
} from 'lucide-react'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [editedData, setEditedData] = useState<any>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()

  // Fetch real user data
  useEffect(() => {
    async function fetchProfile() {
      if (authStatus === 'authenticated') {
        try {
          const res = await fetch('/api/user/profile')
          if (res.ok) {
            const data = await res.json()
            setUserData(data)
            setEditedData(data)
          }
        } catch (error) {
          console.error('Error fetching profile:', error)
        } finally {
          setLoadingProfile(false)
        }
      }
    }
    fetchProfile()
  }, [authStatus])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/login')
    }
  }, [authStatus, router])

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedData),
      })
      
      if (res.ok) {
        const updated = await res.json()
        setUserData(updated)
        setIsEditing(false)
        toast.success('Profile updated successfully!')
      } else {
        toast.error('Failed to update profile.')
      }
    } catch (error) {
      toast.error('Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  const cancelEdit = () => {
    setEditedData(userData)
    setIsEditing(false)
  }

  const addSkill = (name: string) => {
    if (name.trim() && !editedData.skills?.find((s: any) => s.name === name)) {
      setEditedData({
        ...editedData,
        skills: [...(editedData.skills || []), { name: name.trim(), level: 'Intermediate' }]
      })
    }
  }

  const removeSkill = (name: string) => {
    setEditedData({
      ...editedData,
      skills: editedData.skills.filter((s: any) => s.name !== name)
    })
  }

  const addExperience = () => {
    setEditedData({
      ...editedData,
      experience: [...(editedData.experience || []), { company: '', title: '', period: '', description: '' }]
    })
  }

  const addEducation = () => {
    setEditedData({
      ...editedData,
      education: [...(editedData.education || []), { school: '', degree: '', year: '' }]
    })
  }

  const updateItem = (field: string, index: number, subfield: string, value: string) => {
    const updated = [...editedData[field]]
    updated[index] = { ...updated[index], [subfield]: value }
    setEditedData({ ...editedData, [field]: updated })
  }

  const removeItem = (field: string, index: number) => {
    setEditedData({
      ...editedData,
      [field]: editedData[field].filter((_: any, i: number) => i !== index)
    })
  }

  // Show loading while checking auth or fetching profile
  if (authStatus === 'loading' || (authStatus === 'authenticated' && loadingProfile)) {
    return (
      <main className="min-h-screen bg-background w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading your profile...</p>
        </div>
      </main>
    )
  }

  if (authStatus === 'unauthenticated') return null

  const user = userData || {}
  const stats = {
    savedJobs: user.savedJobs?.length || 0,
    applications: user.applications?.length || 0,
    matches: user.skills?.length > 2 ? 3 : 0,
  }

  // Calculate profile strength
  const calculateStrength = () => {
    let score = 0
    if (user.bio) score += 20
    if (user.skills?.length > 0) score += 20
    if (user.experience?.length > 0) score += 20
    if (user.education?.length > 0) score += 20
    if (user.location && user.title) score += 20
    return score
  }

  const strength = calculateStrength()

  return (
    <main className="min-h-screen bg-background pb-20">
      <Navbar />
      <div className="flex gap-8">
        <Sidebar />
        <div className="flex-1 w-full px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold tracking-tight">Your Identity</h1>
              <Badge variant="secondary" className="h-6 gap-1 bg-primary/10 text-primary border-primary/20">
                <Zap className="w-3 h-3 fill-primary" />
                Pro Account
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              {isEditing ? (
                <>
                  <Button variant="ghost" className="gap-2" onClick={cancelEdit}>
                    <X className="w-4 h-4" /> Cancel
                  </Button>
                  <Button className="gap-2 shadow-lg shadow-primary/20" onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="gap-2 border-border/60" onClick={handleLogout}>
                    <LogOut className="w-4 h-4" /> Log Out
                  </Button>
                  <Button className="gap-2 shadow-lg shadow-primary/20" onClick={() => setIsEditing(true)}>
                    <Edit2 className="w-4 h-4" /> Edit Profile
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Hero / Header Card */}
              <Card className="relative overflow-hidden border-border/40 shadow-xl shadow-foreground/5 sm:rounded-3xl">
                <div className="h-32 bg-gradient-to-r from-primary/30 via-accent/25 to-secondary/30 relative">
                  <div className="absolute inset-0 backdrop-blur-[2px]" />
                </div>
                
                <div className="px-8 pb-8 pt-0 -mt-12 relative flex flex-wrap gap-8 items-center">
                  <div className="w-32 h-32 md:w-36 md:h-36 rounded-2xl border-4 border-background bg-card flex items-center justify-center overflow-hidden shadow-2xl relative z-10">
                    {user.image ? (
                      <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-5xl font-black text-primary/20">{user.name?.charAt(0)}</div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-[250px] mb-2 pt-10">
                    {isEditing ? (
                      <div className="space-y-3 pt-4">
                        <Input 
                          value={editedData.name} 
                          onChange={(e) => setEditedData({...editedData, name: e.target.value})} 
                          className="text-3xl font-bold bg-transparent border-b border-primary/20 rounded-none h-auto py-1 px-0"
                          placeholder="Your Name"
                        />
                        <Input 
                          value={editedData.title} 
                          onChange={(e) => setEditedData({...editedData, title: e.target.value})} 
                          className="text-lg text-primary bg-transparent border-none h-auto py-0 px-0 focus-visible:ring-0"
                          placeholder="Professional Title (e.g. UX Designer)"
                        />
                      </div>
                    ) : (
                      <>
                        <h2 className="text-4xl font-black tracking-tight mb-1 text-foreground">{user.name}</h2>
                        <p className="text-xl font-semibold text-primary/90 flex items-center gap-2">
                          {user.title || "Job Seeker"}
                        </p>
                      </>
                    )}
                    
                    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm font-medium text-muted-foreground">
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-foreground/5">
                        <Mail className="w-3.5 h-3.5 text-primary" /> {user.email}
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-foreground/5">
                        <MapPin className="w-3.5 h-3.5 text-primary" /> 
                        {isEditing ? (
                          <input 
                            value={editedData.location} 
                            onChange={(e) => setEditedData({...editedData, location: e.target.value})}
                            className="bg-transparent border-none outline-none focus:ring-0 p-0 text-sm"
                            placeholder="Add Location"
                          />
                        ) : (
                          user.location || "Earth"
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-foreground/5">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> 4.8 Rating
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Bio Section */}
              <Card className="p-8 border-border/40 shadow-lg sm:rounded-3xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-foreground">About Me</h3>
                  {!isEditing && !user.bio && (
                    <Button variant="link" className="p-0 h-auto" onClick={() => setIsEditing(true)}>
                      + Write a bio
                    </Button>
                  )}
                </div>
                
                {isEditing ? (
                  <Textarea 
                    value={editedData.bio} 
                    onChange={(e) => setEditedData({...editedData, bio: e.target.value})}
                    placeholder="Wite a short intro about yourself, your goals, and what you love doing."
                    className="min-h-[150px] text-lg leading-relaxed bg-muted/30 border-dashed border-2"
                  />
                ) : (
                  user.bio ? (
                    <p className="text-lg text-foreground/80 leading-relaxed whitespace-pre-wrap">{user.bio}</p>
                  ) : (
                    <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl bg-muted/20 text-muted-foreground">
                      <Edit2 className="w-8 h-8 mb-3 opacity-20" />
                      <p>Tell the world who you are.</p>
                      <Button variant="outline" className="mt-4" onClick={() => setIsEditing(true)}>Add Bio</Button>
                    </div>
                  )
                )}
              </Card>

              {/* Skills Section */}
              <Card className="p-8 border-border/40 shadow-lg sm:rounded-3xl">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-foreground">Core Expertise</h3>
                  {isEditing && (
                    <div className="flex gap-2">
                       <Input 
                        placeholder="Add skill..." 
                        onKeyDown={(e: any) => { if (e.key === 'Enter') { addSkill(e.target.value); e.target.value = ''; } }}
                        className="w-40 h-9"
                       />
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  {(isEditing ? editedData.skills : user.skills)?.map((skill: any, idx: number) => (
                    <Badge 
                      key={idx} 
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                        isEditing ? 'bg-primary text-white' : 'bg-primary/5 hover:bg-primary/10 text-primary border-primary/10'
                      }`}
                    >
                      {skill.name}
                      {isEditing && (
                        <button onClick={() => removeSkill(skill.name)} className="ml-2 hover:bg-white/20 rounded-full p-0.5">
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                  
                  {!(isEditing ? editedData.skills : user.skills)?.length && (
                    <div className="w-full py-12 text-center border-2 border-dashed rounded-2xl text-muted-foreground">
                      No skills highlighted yet.
                    </div>
                  )}
                </div>
              </Card>

              {/* Experience Section */}
              <Card className="p-8 border-border/40 shadow-lg sm:rounded-3xl">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-primary" /> Experience
                  </h3>
                  {isEditing && (
                    <Button variant="outline" size="sm" onClick={addExperience} className="rounded-xl border-dashed">
                      <Plus className="w-4 h-4 mr-1" /> Add Role
                    </Button>
                  )}
                </div>

                <div className="space-y-12">
                  {(isEditing ? editedData.experience : user.experience)?.map((exp: any, idx: number) => (
                    <div key={idx} className="group relative flex gap-6">
                      <div className="flex flex-col items-center">
                        <div className="w-5 h-5 rounded-full bg-primary ring-4 ring-primary/10 relative z-10" />
                        {idx !== (isEditing ? editedData.experience : user.experience).length - 1 && (
                          <div className="w-0.5 flex-1 bg-gradient-to-b from-primary/50 to-transparent my-1" />
                        )}
                      </div>
                      
                      <div className="flex-1 pb-4">
                        {isEditing ? (
                          <div className="grid gap-3 p-4 bg-muted/30 rounded-2xl border-2 border-dashed relative">
                            <Button size="icon" variant="destructive" className="absolute -top-2 -right-2 w-7 h-7" onClick={() => removeItem('experience', idx)}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                            <Input placeholder="Company" value={exp.company} onChange={(e) => updateItem('experience', idx, 'company', e.target.value)} />
                            <Input placeholder="Job Title" value={exp.title} onChange={(e) => updateItem('experience', idx, 'title', e.target.value)} />
                            <Input placeholder="Period (e.g. 2021 - Present)" value={exp.period} onChange={(e) => updateItem('experience', idx, 'period', e.target.value)} />
                            <Textarea placeholder="What did you achieve?" value={exp.description} onChange={(e) => updateItem('experience', idx, 'description', e.target.value)} />
                          </div>
                        ) : (
                          <>
                            <h4 className="text-xl font-bold leading-tight">{exp.title}</h4>
                            <p className="text-primary font-bold text-sm mb-3">{exp.company} • {exp.period}</p>
                            <p className="text-foreground/80 leading-relaxed">{exp.description}</p>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {!(isEditing ? editedData.experience : user.experience)?.length && !isEditing && (
                    <div className="py-20 text-center border-2 border-dashed rounded-3xl bg-muted/10 text-muted-foreground flex flex-col items-center">
                      <Briefcase className="w-12 h-12 mb-4 opacity-10" />
                      <p className="text-lg">Where have you made an impact?</p>
                      <Button variant="outline" className="mt-4" onClick={() => setIsEditing(true)}>Add Experience</Button>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Sidebar Columns */}
            <div className="space-y-8">
              {/* Profile Strength */}
              <Card className="p-8 border-border/40 shadow-xl sm:rounded-3xl bg-gradient-to-br from-primary/5 to-transparent">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg">Profile Strength</h3>
                  <span className="text-2xl font-black text-primary">{strength}%</span>
                </div>
                <div className="h-4 bg-foreground/5 rounded-full overflow-hidden mb-6">
                  <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${strength}%` }} />
                </div>
                <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" />
                  {strength === 100 ? "Power Profile Achieved!" : "Add more sections to reach 100%!"}
                </p>
              </Card>

              {/* Real-time Stats */}
              <Card className="p-8 border-border/40 shadow-xl sm:rounded-3xl">
                <h3 className="font-bold text-lg mb-6">Activity Snapshot</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/40 rounded-2xl text-center">
                    <p className="text-2xl font-black text-foreground">{stats.savedJobs}</p>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Saved</p>
                  </div>
                  <div className="p-4 bg-muted/40 rounded-2xl text-center">
                    <p className="text-2xl font-black text-foreground">{stats.applications}</p>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Applied</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-primary uppercase tracking-widest">AI Matches</p>
                    <p className="text-lg font-black text-foreground">{stats.matches}</p>
                  </div>
                  <Zap className="w-8 h-8 text-primary fill-primary opacity-20" />
                </div>
              </Card>

              {/* Social Connect */}
              <Card className="p-8 border-border/40 shadow-xl sm:rounded-3xl">
                 <h3 className="font-bold text-lg mb-6">Social Footprint</h3>
                 {isEditing ? (
                   <div className="space-y-4">
                     <div className="relative">
                       <Linkedin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                       <Input 
                        value={editedData.socialLinks?.linkedin} 
                        onChange={(e) => setEditedData({...editedData, socialLinks: {...editedData.socialLinks, linkedin: e.target.value}})}
                        className="pl-10" placeholder="LinkedIn URL" 
                       />
                     </div>
                     <div className="relative">
                       <Github className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                       <Input 
                        value={editedData.socialLinks?.github} 
                        onChange={(e) => setEditedData({...editedData, socialLinks: {...editedData.socialLinks, github: e.target.value}})}
                        className="pl-10" placeholder="GitHub URL" 
                       />
                     </div>
                   </div>
                 ) : (
                   <div className="flex gap-4">
                      {user.socialLinks?.linkedin && (
                        <Button size="icon" variant="outline" className="rounded-xl w-12 h-12 hover:bg-primary hover:text-white transition-colors" asChild>
                          <a href={user.socialLinks.linkedin} target="_blank"><Linkedin className="w-5 h-5" /></a>
                        </Button>
                      )}
                      {user.socialLinks?.github && (
                        <Button size="icon" variant="outline" className="rounded-xl w-12 h-12 hover:bg-primary hover:text-white transition-colors" asChild>
                          <a href={user.socialLinks.github} target="_blank"><Github className="w-5 h-5" /></a>
                        </Button>
                      )}
                      {!user.socialLinks?.linkedin && !user.socialLinks?.github && (
                        <p className="text-sm text-muted-foreground">No links added. Connect your accounts to increase reach.</p>
                      )}
                   </div>
                 )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
