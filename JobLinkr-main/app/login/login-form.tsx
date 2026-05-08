'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { BriefcaseBusiness, Loader2, ShieldCheck, Sparkles, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await signIn('credentials', {
        email: email.trim(),
        password,
        redirect: false,
      })
      if (res?.error) {
        setError('Invalid email or password.')
        return
      }
      router.push(callbackUrl)
      router.refresh()
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
              Modern job matching
            </span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
          <aside className="hidden lg:block">
            <div className="h-full rounded-2xl border border-border/70 bg-card/60 backdrop-blur p-8">
              <div className="space-y-3">
                <h1 className="text-4xl font-bold tracking-tight text-foreground">
                  Welcome to JobLinkr
                </h1>
                <p className="text-muted-foreground">
                  Sign in to explore roles, connect with employers, and use the AI matcher to find your best fit.
                </p>
              </div>

              <ul className="mt-8 space-y-4">
                <li className="flex gap-3 items-start">
                  <Sparkles className="mt-0.5 size-5 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">AI Matcher</p>
                    <p className="text-sm text-muted-foreground">
                      Score and compare jobs against your resume.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <Users className="mt-0.5 size-5 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">Networking</p>
                    <p className="text-sm text-muted-foreground">
                      Build connections with seekers and employers.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <ShieldCheck className="mt-0.5 size-5 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">Secure access</p>
                    <p className="text-sm text-muted-foreground">
                      Credentials-based sign in with hashed passwords.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <BriefcaseBusiness className="mt-0.5 size-5 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">Jobs that fit</p>
                    <p className="text-sm text-muted-foreground">
                      Browse full-time, contract, and freelance roles.
                    </p>
                  </div>
                </li>
              </ul>

              <div className="mt-10 rounded-xl border border-border/60 bg-background/40 p-4">
                <p className="text-sm text-muted-foreground">
                  New here?{' '}
                  <Link href="/signup" className="text-primary font-medium hover:underline">
                    Create an account
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
                  Sign in
                </CardTitle>
                <CardDescription>
                  Use your email and password to continue.
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
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-4">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" />
                        Signing in…
                      </>
                    ) : (
                      'Sign in'
                    )}
                  </Button>

                  <p className="text-sm text-muted-foreground text-center">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="text-primary font-medium hover:underline">
                      Create one
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
