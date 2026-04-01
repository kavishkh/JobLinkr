'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { 
  BriefcaseBusiness, 
  Loader2, 
  Sparkles, 
  Users, 
  ArrowRight, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Linkedin, 
  Github, 
  Globe, 
  Twitter,
  GraduationCap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Step 1: Account
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [role, setRole] = useState<'Seeker' | 'Employer'>('Seeker')
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [age, setAge] = useState('')

  // Step 2: Professional
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [bio, setBio] = useState('')

  // Step 3: Skills & Socials
  const [skillInput, setSkillInput] = useState('')
  const [skills, setSkills] = useState<Array<{ name: string; level: string }>>([])
  const [socials, setSocials] = useState({
    linkedin: '',
    github: '',
    portfolio: '',
    twitter: '',
  })

  // Step 4: Experience
  const [experience, setExperience] = useState<Array<{
    company: string
    title: string
    period: string
    description: string
  }>>([])

  // Step 5: Education
  const [education, setEducation] = useState<Array<{
    school: string
    degree: string
    year: string
  }>>([])

  const addSkill = () => {
    if (skillInput.trim()) {
      setSkills([...skills, { name: skillInput.trim(), level: 'Intermediate' }])
      setSkillInput('')
    }
  }

  const removeSkill = (name: string) => {
    setSkills(skills.filter(s => s.name !== name))
  }

  const addExperience = () => {
    setExperience([...experience, { company: '', title: '', period: '', description: '' }])
  }

  const updateExperience = (index: number, field: string, value: string) => {
    const newExp = [...experience]
    newExp[index] = { ...newExp[index], [field]: value }
    setExperience(newExp)
  }

  const removeExperience = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index))
  }

  const addEducation = () => {
    setEducation([...education, { school: '', degree: '', year: '' }])
  }

  const updateEducation = (index: number, field: string, value: string) => {
    const newEdu = [...education]
    newEdu[index] = { ...newEdu[index], [field]: value }
    setEducation(newEdu)
  }

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index))
  }

  const nextStep = () => {
    if (step === 1) {
      if (!name || !email || !password || !confirm || !age) {
        setError('Please fill in all required fields.')
        return
      }
      if (password !== confirm) {
        setError('Passwords do not match.')
        return
      }
      const ageNum = Number(age)
      if (!Number.isInteger(ageNum) || ageNum < 13 || ageNum > 100) {
        setError('Please enter a valid age (13-100).')
        return
      }
    }
    setError(null)
    setStep(step + 1)
  }

  const prevStep = () => setStep(step - 1)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
          gender,
          age: Number(age),
          title: title.trim(),
          location: location.trim(),
          bio: bio.trim(),
          socialLinks: socials,
          skills,
          experience,
          education,
        }),
      })

      const data = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(data.error ?? 'Could not create account.')
        return
      }

      const sign = await signIn('credentials', {
        email: email.trim(),
        password,
        redirect: false,
      })

      if (sign?.error) {
        setError('Account created but sign-in failed. Try logging in.')
        return
      }

      router.push('/profile')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-primary/15 via-background to-secondary/20"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary/15 border border-border rounded-xl flex items-center justify-center font-bold text-primary">
              J
            </div>
            <span className="font-bold text-xl text-foreground">JobLinkr</span>
          </Link>
          
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div 
                key={s} 
                className={`w-8 h-1.5 rounded-full transition-all ${s <= step ? 'bg-primary' : 'bg-muted'}`}
              />
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
          <aside className="hidden lg:block">
            <div className="space-y-6">
              <h1 className="text-5xl font-bold tracking-tight text-foreground leading-tight">
                {step === 1 && "Start your journey with us."}
                {step === 2 && "Tell us about your professional self."}
                {step === 3 && "Showcase your skills & socials."}
                {step === 4 && "Your professional experience."}
                {step === 5 && "Finally, your education."}
              </h1>
              <p className="text-xl text-muted-foreground">
                {step === 1 && "Create your account to start matching with great opportunities."}
                {step === 2 && "Add your professional title and a brief bio to stand out."}
                {step === 3 && "Let employers know what you're good at and where to find you."}
                {step === 4 && "Highlight your past roles and achievements."}
                {step === 5 && "Add your academic background to complete your profile."}
              </p>
            </div>
          </aside>

          <section className="flex items-center justify-center">
            <Card className="w-full max-w-lg border-border/70 bg-card/70 backdrop-blur-xl shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="text-2xl font-serif">
                  Step {step}: {
                    step === 1 ? "Account Details" : 
                    step === 2 ? "Professional Intro" : 
                    step === 3 ? "Skills & Links" : 
                    step === 4 ? "Experience" : 
                    "Education"
                  }
                </CardTitle>
                <CardDescription>
                  {step === 1 ? "Start with basics." : "Add more details to your profile."}
                </CardDescription>
              </CardHeader>

              <form onSubmit={onSubmit}>
                <CardContent className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  {error && (
                    <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2" role="alert">
                      {error}
                    </p>
                  )}

                  {step === 1 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Johnson" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alex@example.com" required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm">Confirm</Label>
                          <Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="age">Age</Label>
                          <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="24" required />
                        </div>
                        <div className="space-y-2">
                          <Label>Gender</Label>
                          <RadioGroup value={gender} onValueChange={(v) => setGender(v as any)} className="flex gap-4 pt-2">
                            <div className="flex items-center gap-2"><RadioGroupItem value="male" id="m" /><Label htmlFor="m">Male</Label></div>
                            <div className="flex items-center gap-2"><RadioGroupItem value="female" id="f" /><Label htmlFor="f">Female</Label></div>
                          </RadioGroup>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Joining as</Label>
                        <RadioGroup value={role} onValueChange={(v) => setRole(v as any)} className="grid grid-cols-2 gap-4">
                          <Label htmlFor="seeker" className="flex flex-col items-center gap-2 rounded-xl border border-border p-4 cursor-pointer hover:bg-muted/50 [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5">
                            <RadioGroupItem value="Seeker" id="seeker" className="sr-only" />
                            <Users className="w-5 h-5" />
                            <span className="font-semibold">Job Seeker</span>
                          </Label>
                          <Label htmlFor="employer" className="flex flex-col items-center gap-2 rounded-xl border border-border p-4 cursor-pointer hover:bg-muted/50 [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5">
                            <RadioGroupItem value="Employer" id="employer" className="sr-only" />
                            <BriefcaseBusiness className="w-5 h-5" />
                            <span className="font-semibold">Employer</span>
                          </Label>
                        </RadioGroup>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="space-y-2">
                        <Label htmlFor="title">Professional Title</Label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Full Stack Developer" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. San Francisco, CA" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself..." className="min-h-[120px]" />
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="space-y-3">
                        <Label>Skills</Label>
                        <div className="flex gap-2">
                          <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="e.g. React" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
                          <Button type="button" onClick={addSkill} variant="secondary"><Plus className="w-4 h-4" /></Button>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {skills.map((s) => (
                            <Badge key={s.name} variant="secondary" className="gap-1 pr-1 py-1">
                              {s.name}
                              <button type="button" onClick={() => removeSkill(s.name)} className="hover:text-destructive"><Trash2 className="w-3 h-3" /></button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label>Social Links</Label>
                        <div className="grid gap-3">
                          <div className="relative">
                            <Linkedin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                            <Input value={socials.linkedin} onChange={(e) => setSocials({...socials, linkedin: e.target.value})} placeholder="LinkedIn URL" className="pl-10" />
                          </div>
                          <div className="relative">
                            <Github className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                            <Input value={socials.github} onChange={(e) => setSocials({...socials, github: e.target.value})} placeholder="Github URL" className="pl-10" />
                          </div>
                          <div className="relative">
                            <Globe className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                            <Input value={socials.portfolio} onChange={(e) => setSocials({...socials, portfolio: e.target.value})} placeholder="Portfolio / Website" className="pl-10" />
                          </div>
                          <div className="relative">
                            <Twitter className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                            <Input value={socials.twitter} onChange={(e) => setSocials({...socials, twitter: e.target.value})} placeholder="Twitter URL" className="pl-10" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="flex items-center justify-between">
                        <Label className="text-lg">Experience</Label>
                        <Button type="button" onClick={addExperience} variant="outline" size="sm" className="gap-1.5"><Plus className="w-4 h-4" /> Add Role</Button>
                      </div>
                      <div className="space-y-6">
                        {experience.map((exp, idx) => (
                          <div key={idx} className="p-4 rounded-xl border border-border bg-background/50 space-y-4 relative group">
                            <button type="button" onClick={() => removeExperience(idx)} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-white items-center justify-center hidden group-hover:flex shadow-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                            <div className="grid gap-4">
                              <Input placeholder="Company" value={exp.company} onChange={(e) => updateExperience(idx, 'company', e.target.value)} />
                              <Input placeholder="Title" value={exp.title} onChange={(e) => updateExperience(idx, 'title', e.target.value)} />
                              <Input placeholder="Period (e.g. 2021 - Present)" value={exp.period} onChange={(e) => updateExperience(idx, 'period', e.target.value)} />
                              <Textarea placeholder="Key accomplishments..." value={exp.description} onChange={(e) => updateExperience(idx, 'description', e.target.value)} />
                            </div>
                          </div>
                        ))}
                        {experience.length === 0 && <p className="text-sm text-muted-foreground text-center py-4 italic">No experience added yet.</p>}
                      </div>
                    </div>
                  )}

                  {step === 5 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="flex items-center justify-between">
                        <Label className="text-lg">Education</Label>
                        <Button type="button" onClick={addEducation} variant="outline" size="sm" className="gap-1.5"><Plus className="w-4 h-4" /> Add Achievement</Button>
                      </div>
                      <div className="space-y-6">
                        {education.map((edu, idx) => (
                          <div key={idx} className="p-4 rounded-xl border border-border bg-background/50 space-y-4 relative group">
                            <button type="button" onClick={() => removeEducation(idx)} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-white items-center justify-center hidden group-hover:flex shadow-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                            <div className="grid gap-4">
                              <Input placeholder="School / University" value={edu.school} onChange={(e) => updateEducation(idx, 'school', e.target.value)} />
                              <Input placeholder="Degree (e.g. BS in Computer Science)" value={edu.degree} onChange={(e) => updateEducation(idx, 'degree', e.target.value)} />
                              <Input placeholder="Graduation Year" value={edu.year} onChange={(e) => updateEducation(idx, 'year', e.target.value)} />
                            </div>
                          </div>
                        ))}
                        {education.length === 0 && <p className="text-sm text-muted-foreground text-center py-4 italic">No education added yet.</p>}
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex justify-between gap-4 pt-6 border-t mt-6">
                  {step > 1 ? (
                    <Button type="button" variant="outline" onClick={prevStep} className="gap-2"><ArrowLeft className="w-4 h-4" /> Back</Button>
                  ) : (
                    <Link href="/login" className="text-sm text-muted-foreground hover:underline pt-2">Already have an account? Sign in</Link>
                  )}

                  {step < 5 ? (
                    <Button type="button" onClick={nextStep} className="gap-2">Continue <ArrowRight className="w-4 h-4" /></Button>
                  ) : (
                    <Button type="submit" className="gap-2" disabled={loading}>
                      {loading ? <><Loader2 className="animate-spin w-4 h-4" /> Creating...</> : "Complete Signup"}
                    </Button>
                  )}
                </CardFooter>
              </form>
            </Card>
          </section>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: hsl(var(--border)); border-radius: 10px; }
      `}</style>
    </div>
  )
}
