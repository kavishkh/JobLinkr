'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, getSession } from 'next-auth/react'
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

      // Get session to check role
      const session = await getSession()
      const role = (session?.user as any)?.role

      if (callbackUrl === '/') {
        if (role === 'Employer') {
          router.push('/employer')
        } else {
          router.push('/jobs')
        }
      } else {
        router.push(callbackUrl)
      }
      
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

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground font-bold tracking-wider">Or continue with</span>
            </div>
          </div>

          <div className="mt-8">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => signIn('google', { callbackUrl: '/' })}
              className="w-full h-12 rounded-xl border-border/50 bg-secondary/30 hover:bg-secondary/50 hover:border-primary/30 hover:shadow-premium font-bold transition-all hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-3"
            >
              <svg className="size-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </Button>
          </div>

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

