import { Suspense } from 'react'
import { LoginForm } from './login-form'

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-muted-foreground text-sm">Loading…</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
