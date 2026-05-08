'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { BriefcaseBusiness, Loader2, ShieldCheck, Sparkles, Users, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-background">
      {/* Left Side: Visual/Branding (Hidden on mobile) */}
      <div className="relative hidden w-full lg:flex lg:w-1/2 flex-col justify-between p-12 bg-slate-950 overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-primary/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-accent/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              J
            </div>
            <span className="font-bold text-2xl text-white tracking-tight font-outfit">JobLink<span className="text-primary">r</span></span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-5xl font-extrabold text-white mb-6 leading-tight font-outfit tracking-tight">
            Connect with your <span className="text-primary italic">future</span> career.
          </h1>
          <p className="text-lg text-slate-400 mb-10 font-medium">
            Join thousands of professionals and top-tier companies finding their perfect match on JobLinkr.
          </p>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="size-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                <Sparkles className="size-5 text-primary" />
              </div>
              <p className="text-sm font-bold text-white">AI Matching</p>
              <p className="text-xs text-slate-500">Smart resume analysis</p>
            </div>
            <div className="space-y-2">
              <div className="size-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                <Users className="size-5 text-accent" />
              </div>
              <p className="text-sm font-bold text-white">Networking</p>
              <p className="text-xs text-slate-500">Connect with leaders</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500 font-medium">
          © 2026 JobLinkr. The future of professional networking.
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-24 bg-background">
        <div className="mx-auto w-full max-w-sm">
          <div className="lg:hidden mb-12">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-bold text-white">J</div>
              <span className="font-bold text-2xl text-foreground font-outfit tracking-tight">JobLinkr</span>
            </Link>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight font-outfit mb-2">Sign in</h2>
            <p className="text-muted-foreground font-medium">Welcome back! Please enter your details.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold flex items-center gap-2">
              <ShieldCheck className="size-4" />
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl bg-secondary/50 border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</Label>
                <Link href="#" className="text-xs font-bold text-primary hover:underline">Forgot password?</Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-xl bg-secondary/50 border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
            </div>

            <Button type="submit" className="w-full h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 size-4" />
                  Signing in...
                </>
              ) : (
                'Sign in to account'
              )}
            </Button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-muted-foreground font-medium">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-primary font-bold hover:underline">
                Create one now
              </Link>
            </p>
          </div>

          <div className="mt-12 flex items-center gap-4">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors group">
              <ArrowLeft className="size-3.5 group-hover:-translate-x-1 transition-transform" />
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

