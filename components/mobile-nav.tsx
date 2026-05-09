'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Briefcase, Sparkles, User, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'

export function MobileNav() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const role = session?.user?.role

  const items = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/jobs', label: 'Jobs', icon: Briefcase },
    { href: '/matcher', label: 'Match', icon: Sparkles },
    { href: '/employer', label: 'Hire', icon: Building2, requiresEmployer: true },
    { href: '/profile', label: 'Profile', icon: User },
  ].filter(item => {
    if (item.requiresEmployer && role?.toLowerCase() === 'seeker') return false
    return true
  })

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border/50 px-4 pb-safe">
      <div className="flex items-center justify-around h-16">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 min-w-[64px] h-full transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "p-1 rounded-lg transition-all",
                isActive && "bg-primary/10"
              )}>
                <Icon className={cn("size-5", isActive && "fill-primary/20")} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
