'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { BriefcaseBusiness, Loader2, Sparkles, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function SignupPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [role, setRole] = useState<'Seeker' | 'Employer'>('Seeker')
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [age, setAge] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    const ageNum = Number(age)
    if (!Number.isInteger(ageNum) || ageNum < 13 || ageNum > 100) {
      setError('Please enter a valid age (13-100).')
      return
    }

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
          age: ageNum,
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
      router.push('/')
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
      <div
        aria-hidden
        className="pointer-events-none absolute -top-28 -left-28 h-72 w-72 rounded-full bg-primary/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-36 -right-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary/15 border border-border rounded-xl flex items-center justify-center font-bold text-primary">
              J
            </div>
            <span className="font-bold text-xl text-foreground">JobLinkr</span>
          </Link>

          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1">
              <Sparkles className="size-3.5 text-primary" />
              Create. Connect. Hire.
            </span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
          <aside className="hidden lg:block">
            <div className="h-full rounded-2xl border border-border/70 bg-card/60 backdrop-blur p-8">
              <div className="space-y-3">
                <h1 className="text-4xl font-bold tracking-tight text-foreground">
                  Join JobLinkr
                </h1>
                <p className="text-muted-foreground">
                  Build your profile, match with opportunities, and connect with employers.
                </p>
              </div>

              <ul className="mt-8 space-y-4">
                <li className="flex gap-3 items-start">
                  <Sparkles className="mt-0.5 size-5 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">AI resume scoring</p>
                    <p className="text-sm text-muted-foreground">
                      Get instant match feedback for roles.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <Users className="mt-0.5 size-5 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">Role-specific networking</p>
                    <p className="text-sm text-muted-foreground">
                      Seeker and employer experiences that fit.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <BriefcaseBusiness className="mt-0.5 size-5 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">Jobs & hiring</p>
                    <p className="text-sm text-muted-foreground">
                      Explore, post, and hire talent with ease.
                    </p>
                  </div>
                </li>
              </ul>

              <div className="mt-10 rounded-xl border border-border/60 bg-background/40 p-4">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="text-primary font-medium hover:underline"
                  >
                    Sign in
                  </Link>
                  .
                </p>
              </div>
            </div>
          </aside>

          <section className="flex items-center">
            <Card className="w-full max-w-md mx-auto border-border/70 bg-card/70 backdrop-blur-xl shadow-lg">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-serif tracking-tight">
                  Create your account
                </CardTitle>
                <CardDescription>
                  Join JobLinkr to explore jobs, post, and connect with employers.
                </CardDescription>
              </CardHeader>

              <form onSubmit={onSubmit}>
                <CardContent className="space-y-4">
                  {error && (
                    <p
                      className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2"
                      role="alert"
                    >
                      {error}
                    </p>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input
                      id="name"
                      name="name"
                      autoComplete="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Johnson"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      At least 8 characters.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm">Confirm password</Label>
                    <Input
                      id="confirm"
                      name="confirm"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Gender</Label>
                    <RadioGroup
                      value={gender}
                      onValueChange={(v) => setGender(v as 'male' | 'female')}
                      className="flex flex-col gap-2"
                    >
                      <label className="flex items-center gap-3 rounded-md border border-border px-3 py-2 cursor-pointer hover:bg-muted/50 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring">
                        <RadioGroupItem value="male" id="gender-male" />
                        <span className="text-sm">
                          <span className="font-medium">Male</span>
                        </span>
                      </label>
                      <label className="flex items-center gap-3 rounded-md border border-border px-3 py-2 cursor-pointer hover:bg-muted/50 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring">
                        <RadioGroupItem value="female" id="gender-female" />
                        <span className="text-sm">
                          <span className="font-medium">Female</span>
                        </span>
                      </label>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      min={13}
                      max={100}
                      required
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="e.g. 24"
                    />
                    <p className="text-xs text-muted-foreground">Enter age between 13 and 100.</p>
                  </div>

                  <div className="space-y-3">
                    <Label>I am joining as</Label>
                    <RadioGroup
                      value={role}
                      onValueChange={(v) => setRole(v as 'Seeker' | 'Employer')}
                      className="flex flex-col gap-2"
                    >
                      <label className="flex items-center gap-3 rounded-md border border-border px-3 py-2 cursor-pointer hover:bg-muted/50 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring">
                        <RadioGroupItem value="Seeker" id="seeker" />
                        <span className="text-sm">
                          <span className="font-medium">Job seeker</span>
                          <span className="text-muted-foreground block text-xs">
                            Find roles and grow your network
                          </span>
                        </span>
                      </label>
                      <label className="flex items-center gap-3 rounded-md border border-border px-3 py-2 cursor-pointer hover:bg-muted/50 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring">
                        <RadioGroupItem value="Employer" id="employer" />
                        <span className="text-sm">
                          <span className="font-medium">Employer</span>
                          <span className="text-muted-foreground block text-xs">
                            Post jobs and hire talent
                          </span>
                        </span>
                      </label>
                    </RadioGroup>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-4">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" />
                        Creating account…
                      </>
                    ) : (
                      'Create account'
                    )}
                  </Button>

                  <p className="text-sm text-muted-foreground text-center">
                    Already have an account?{' '}
                    <Link
                      href="/login"
                      className="text-primary font-medium hover:underline"
                    >
                      Sign in
                    </Link>
                  </p>
                </CardFooter>
              </form>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}
