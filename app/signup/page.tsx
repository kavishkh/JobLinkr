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
  GraduationCap,
  CheckCircle2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
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
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const prevStep = () => {
    setStep(step - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-background">
      {/* Left Side: Progress & Info */}
      <div className="relative hidden w-full lg:flex lg:w-1/2 flex-col justify-between p-12 bg-slate-950 overflow-hidden">
        <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-primary/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-bold text-white">J</div>
            <span className="font-bold text-2xl text-white tracking-tight font-outfit">JobLink<span className="text-primary">r</span></span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
            Step {step} of 5
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-6 leading-tight font-outfit tracking-tight">
            {step === 1 && "Start your journey with us."}
            {step === 2 && "Tell us about your professional self."}
            {step === 3 && "Showcase your skills & socials."}
            {step === 4 && "Your professional experience."}
            {step === 5 && "Finally, your education."}
          </h1>
          <p className="text-xl text-slate-400 font-medium">
            {step === 1 && "Create your account to start matching with great opportunities."}
            {step === 2 && "Add your professional title and a brief bio to stand out."}
            {step === 3 && "Let employers know what you're good at and where to find you."}
            {step === 4 && "Highlight your past roles and achievements."}
            {step === 5 && "Add your academic background to complete your profile."}
          </p>

          <div className="mt-12 space-y-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex items-center gap-4">
                <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  s < step ? 'bg-primary border-primary text-white' : 
                  s === step ? 'border-primary text-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]' : 
                  'border-white/10 text-white/30'
                }`}>
                  {s < step ? <CheckCircle2 className="size-4" /> : s}
                </div>
                <span className={`text-sm font-bold tracking-tight ${s === step ? 'text-white' : 'text-slate-500'}`}>
                  {s === 1 && "Account Info"}
                  {s === 2 && "Professional Profile"}
                  {s === 3 && "Skills & Links"}
                  {s === 4 && "Experience"}
                  {s === 5 && "Education"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500 font-medium">
          Secure & Encrypted. Your data is safe with us.
        </div>
      </div>

      {/* Right Side: Signup Form */}
      <div className="flex flex-1 flex-col px-6 py-12 lg:px-24 bg-background overflow-y-auto">
        <div className="mx-auto w-full max-w-lg">
          <div className="lg:hidden mb-8">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-bold text-white">J</div>
                <span className="font-bold text-2xl text-foreground font-outfit tracking-tight">JobLinkr</span>
              </Link>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Step {step}/5</span>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight font-outfit mb-2">
              {step === 1 ? "Create Account" : 
               step === 2 ? "Professional Info" : 
               step === 3 ? "Skills & Socials" : 
               step === 4 ? "Experience" : 
               "Education"}
            </h2>
            <p className="text-muted-foreground font-medium">Please provide the following details to continue.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-8">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Johnson" required className="h-12 rounded-xl bg-secondary/50 border-none font-medium" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alex@example.com" required className="h-12 rounded-xl bg-secondary/50 border-none font-medium" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</Label>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-12 rounded-xl bg-secondary/50 border-none font-medium" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Confirm</Label>
                    <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required className="h-12 rounded-xl bg-secondary/50 border-none font-medium" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Age</Label>
                    <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="24" required className="h-12 rounded-xl bg-secondary/50 border-none font-medium" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Gender</Label>
                    <RadioGroup value={gender} onValueChange={(v) => setGender(v as any)} className="flex gap-4 pt-2">
                      <div className="flex items-center gap-2"><RadioGroupItem value="male" id="m" /><Label htmlFor="m" className="font-bold">Male</Label></div>
                      <div className="flex items-center gap-2"><RadioGroupItem value="female" id="f" /><Label htmlFor="f" className="font-bold">Female</Label></div>
                    </RadioGroup>
                  </div>
                </div>
                <div className="space-y-4">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">I am a...</Label>
                  <RadioGroup value={role} onValueChange={(v) => setRole(v as any)} className="grid grid-cols-2 gap-4">
                    <Label htmlFor="seeker" className="flex flex-col items-center gap-2 rounded-2xl border-2 border-transparent bg-secondary/30 p-6 cursor-pointer hover:bg-secondary/50 [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5 transition-all">
                      <RadioGroupItem value="Seeker" id="seeker" className="sr-only" />
                      <Users className="size-6 mb-1 text-primary" />
                      <span className="font-bold">Job Seeker</span>
                    </Label>
                    <Label htmlFor="employer" className="flex flex-col items-center gap-2 rounded-2xl border-2 border-transparent bg-secondary/30 p-6 cursor-pointer hover:bg-secondary/50 [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5 transition-all">
                      <RadioGroupItem value="Employer" id="employer" className="sr-only" />
                      <BriefcaseBusiness className="size-6 mb-1 text-primary" />
                      <span className="font-bold">Employer</span>
                    </Label>
                  </RadioGroup>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Professional Title</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Full Stack Developer" className="h-12 rounded-xl bg-secondary/50 border-none font-medium" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Location</Label>
                  <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. San Francisco, CA" className="h-12 rounded-xl bg-secondary/50 border-none font-medium" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Bio</Label>
                  <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Briefly describe yourself and your goals..." className="min-h-[150px] rounded-xl bg-secondary/50 border-none font-medium p-4" />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-4">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Skills</Label>
                  <div className="flex gap-2">
                    <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="Add a skill (e.g. React)" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} className="h-12 rounded-xl bg-secondary/50 border-none font-medium" />
                    <Button type="button" onClick={addSkill} className="rounded-xl h-12 w-12 p-0"><Plus className="size-5" /></Button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {skills.map((s) => (
                      <Badge key={s.name} className="gap-1.5 pl-3 pr-2 py-1.5 bg-primary/10 text-primary border-none text-xs font-bold rounded-lg group">
                        {s.name}
                        <button type="button" onClick={() => removeSkill(s.name)} className="hover:text-primary-foreground hover:bg-primary rounded-full p-0.5 transition-colors"><Trash2 className="size-3" /></button>
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Social Presence</Label>
                  <div className="grid gap-4">
                    <div className="relative">
                      <Linkedin className="absolute left-4 top-3.5 size-5 text-muted-foreground" />
                      <Input value={socials.linkedin} onChange={(e) => setSocials({...socials, linkedin: e.target.value})} placeholder="LinkedIn Profile URL" className="h-12 pl-12 rounded-xl bg-secondary/50 border-none font-medium" />
                    </div>
                    <div className="relative">
                      <Github className="absolute left-4 top-3.5 size-5 text-muted-foreground" />
                      <Input value={socials.github} onChange={(e) => setSocials({...socials, github: e.target.value})} placeholder="GitHub Profile URL" className="h-12 pl-12 rounded-xl bg-secondary/50 border-none font-medium" />
                    </div>
                    <div className="relative">
                      <Globe className="absolute left-4 top-3.5 size-5 text-muted-foreground" />
                      <Input value={socials.portfolio} onChange={(e) => setSocials({...socials, portfolio: e.target.value})} placeholder="Portfolio or Personal Website" className="h-12 pl-12 rounded-xl bg-secondary/50 border-none font-medium" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Work History</Label>
                  <Button type="button" onClick={addExperience} variant="outline" size="sm" className="rounded-full font-bold border-primary/20 text-primary hover:bg-primary/5">
                    <Plus className="size-4 mr-2" />
                    Add Role
                  </Button>
                </div>
                <div className="space-y-6">
                  {experience.map((exp, idx) => (
                    <div key={idx} className="relative p-6 rounded-2xl bg-secondary/20 border border-border/50 group animate-in zoom-in-95 duration-300">
                      <button type="button" onClick={() => removeExperience(idx)} className="absolute -top-3 -right-3 size-8 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"><Trash2 className="size-4" /></button>
                      <div className="space-y-4">
                        <Input placeholder="Company Name" value={exp.company} onChange={(e) => updateExperience(idx, 'company', e.target.value)} className="bg-background/50 border-none font-bold" />
                        <Input placeholder="Job Title" value={exp.title} onChange={(e) => updateExperience(idx, 'title', e.target.value)} className="bg-background/50 border-none font-medium" />
                        <Input placeholder="Period (e.g. Jan 2021 - Present)" value={exp.period} onChange={(e) => updateExperience(idx, 'period', e.target.value)} className="bg-background/50 border-none font-medium" />
                        <Textarea placeholder="Key responsibilities and achievements..." value={exp.description} onChange={(e) => updateExperience(idx, 'description', e.target.value)} className="bg-background/50 border-none min-h-[100px] p-4" />
                      </div>
                    </div>
                  ))}
                  {experience.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl">
                      <BriefcaseBusiness className="size-8 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-sm font-bold text-muted-foreground">No experience added yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Education</Label>
                  <Button type="button" onClick={addEducation} variant="outline" size="sm" className="rounded-full font-bold border-primary/20 text-primary hover:bg-primary/5">
                    <Plus className="size-4 mr-2" />
                    Add Degree
                  </Button>
                </div>
                <div className="space-y-6">
                  {education.map((edu, idx) => (
                    <div key={idx} className="relative p-6 rounded-2xl bg-secondary/20 border border-border/50 group animate-in zoom-in-95 duration-300">
                      <button type="button" onClick={() => removeEducation(idx)} className="absolute -top-3 -right-3 size-8 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"><Trash2 className="size-4" /></button>
                      <div className="space-y-4">
                        <Input placeholder="University or School" value={edu.school} onChange={(e) => updateEducation(idx, 'school', e.target.value)} className="bg-background/50 border-none font-bold" />
                        <Input placeholder="Degree (e.g. BS in Design)" value={edu.degree} onChange={(e) => updateEducation(idx, 'degree', e.target.value)} className="bg-background/50 border-none font-medium" />
                        <Input placeholder="Graduation Year" value={edu.year} onChange={(e) => updateEducation(idx, 'year', e.target.value)} className="bg-background/50 border-none font-medium" />
                      </div>
                    </div>
                  ))}
                  {education.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl">
                      <GraduationCap className="size-8 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-sm font-bold text-muted-foreground">No academic background added yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-6 pt-10 border-t border-border/50">
              {step > 1 ? (
                <Button type="button" variant="ghost" onClick={prevStep} className="h-12 px-6 rounded-xl font-bold hover:bg-secondary">
                  <ArrowLeft className="size-4 mr-2" />
                  Back
                </Button>
              ) : (
                <div />
              )}

              {step < 5 ? (
                <Button type="button" onClick={nextStep} className="h-12 px-8 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
                  Next Step
                  <ArrowRight className="size-4 ml-2" />
                </Button>
              ) : (
                <Button type="submit" disabled={loading} className="h-12 px-8 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 size-4" />
                      Creating Account...
                    </>
                  ) : (
                    "Complete Signup"
                  )}
                </Button>
              )}
            </div>

            {step === 1 && (
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground font-medium">
                  Already have an account?{' '}
                  <Link href="/login" className="text-primary font-bold hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

