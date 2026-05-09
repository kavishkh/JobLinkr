'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { LogOut, Search, Settings, Users, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { currentUser } from '@/lib/mockData'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()
  const displayUser = session?.user
  const role = displayUser?.role ?? currentUser.role

  const navItems = [
    { label: 'Explore', href: '/' },
    { label: 'Jobs', href: '/jobs' },
    { label: 'AI Matcher', href: '/matcher', requiresAuth: true, icon: <Sparkles className="size-3.5 mr-1" /> },
    { label: 'Employer Hub', href: '/employer', requiresEmployer: true },
  ].filter(item => {
    if (item.requiresEmployer && role?.toLowerCase() === 'seeker') return false
    return true
  })

  const handleNavClick = (e: React.MouseEvent, item: typeof navItems[0]) => {
    if (item.requiresAuth && status !== 'authenticated') {
      e.preventDefault()
      router.push('/login')
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-white/10 dark:border-white/5">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Logo & Sidebar Toggle */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <SidebarTrigger className="text-foreground/70 hover:text-foreground hover:bg-primary/10 transition-colors rounded-lg h-9 w-9" />
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              J
            </div>
            <span className="font-bold text-xl text-foreground hidden sm:inline tracking-tight font-outfit">
              JobLink<span className="text-primary">r</span>
            </span>
          </Link>
        </div>

        {/* Center: Main Navigation */}
        <div className="hidden lg:flex items-center gap-1 bg-secondary/50 p-1 rounded-full border border-border/50">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item)}
              className={cn(
                "text-sm font-medium px-5 py-2 rounded-full transition-all duration-200 flex items-center",
                pathname === item.href
                  ? "bg-background text-primary shadow-sm ring-1 ring-border/50"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              )}
            >
              {(item as any).icon}
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right: Search & Actions */}
        <div className="flex-1 max-w-sm hidden md:flex items-center mx-4">
          <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search jobs, talent, skills..."
              className="w-full pl-10 h-10 bg-secondary/50 border-border/50 rounded-full text-sm placeholder:text-muted-foreground focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all border-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {status === 'unauthenticated' && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground/70 hover:text-foreground hover:bg-secondary rounded-full px-5 hidden sm:inline-flex"
                asChild
              >
                <Link href="/login">Log in</Link>
              </Button>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                asChild
              >
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          )}

          {status === 'authenticated' && displayUser && (
            <div className="flex items-center gap-3">
              <div className="hidden xl:flex flex-col items-end mr-1">
                <span className="text-sm font-bold text-foreground leading-none">
                  {displayUser.name}
                </span>
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-1">
                  {role}
                </span>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary ring-offset-2 transition-all"
                  >
                    <Avatar className="w-10 h-10 border-2 border-background shadow-premium hover:scale-105 transition-transform">
                      <AvatarImage
                        src={displayUser.image ?? undefined}
                        alt={displayUser.name ?? 'User'}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {(displayUser.name ?? '?').charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 mt-2 rounded-2xl p-2 border-border/50 shadow-2xl glass">
                  <div className="px-3 py-3">
                    <div className="text-sm font-bold text-foreground truncate">
                      {displayUser.name}
                    </div>
                    <div className="text-xs font-medium text-muted-foreground truncate">
                      {displayUser.email}
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-border/50 my-1" />
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2.5">
                    <Link href="/profile" className="w-full flex items-center">
                      <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
                        <Users className="size-4 text-primary" />
                      </div>
                      <span className="font-medium text-sm">My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2.5">
                    <Link href="/settings" className="w-full flex items-center">
                      <div className="size-8 rounded-lg bg-secondary flex items-center justify-center mr-3">
                        <Settings className="size-4 text-muted-foreground" />
                      </div>
                      <span className="font-medium text-sm">Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/50 my-1" />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="text-destructive focus:text-destructive focus:bg-destructive/10 rounded-xl cursor-pointer py-2.5"
                  >
                    <div className="size-8 rounded-lg bg-destructive/10 flex items-center justify-center mr-3">
                      <LogOut className="size-4" />
                    </div>
                    <span className="font-medium text-sm">Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
