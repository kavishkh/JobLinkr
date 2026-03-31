'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { LogOut, Search } from 'lucide-react'
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
  const { data: session, status } = useSession()
  const displayUser = session?.user
  const role = displayUser?.role ?? currentUser.role

  const navItems = [
    { label: 'Explore', href: '/' },
    { label: 'Jobs', href: '/jobs' },
    { label: 'AI Matcher', href: '/matcher' },
    { label: 'Employer Hub', href: '/employer' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-primary border-b border-primary/80 w-full">
      <div className="w-full px-4 md:px-8 h-16 flex items-center justify-between gap-6">
        {/* Left: Logo & Sidebar Toggle */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <SidebarTrigger className="text-white hover:bg-white/10" />
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white font-bold border border-white/30">
              J
            </div>
            <span className="font-bold text-xl text-white hidden sm:inline">JobLinkr</span>
          </Link>
        </div>

        {/* Center: Main Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-semibold transition-colors",
                pathname === item.href
                  ? "text-white font-bold underline underline-offset-4"
                  : "text-white/70 hover:text-white"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right: Search & Actions */}
        <div className="flex-1 max-w-[180px] sm:max-w-sm hidden sm:flex items-center ml-auto">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <Input
              placeholder="Search..."
              className="w-full pl-9 h-10 bg-white/10 border border-white/20 rounded-md text-sm text-white placeholder:text-white/50 focus:ring-1 focus:ring-white/50 focus:bg-white/15"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {status === 'authenticated' && (
            <div className="hidden lg:inline-flex items-center gap-2 mr-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/50">
                {role}
              </span>
            </div>
          )}

          {status === 'loading' && (
            <div className="w-9 h-9 rounded-full bg-white/10 animate-pulse" />
          )}

          {status === 'unauthenticated' && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 hidden sm:inline-flex"
                asChild
              >
                <Link href="/login">Log in</Link>
              </Button>
              <Button
                size="sm"
                className="bg-white text-primary hover:bg-white/90"
                asChild
              >
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          )}

          {status === 'authenticated' && displayUser && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  aria-label="Account menu"
                >
                  <Avatar className="w-9 h-9 cursor-pointer hover:ring-2 ring-white/60 transition-all">
                    <AvatarImage
                      src={displayUser.image ?? undefined}
                      alt={displayUser.name ?? 'User'}
                    />
                    <AvatarFallback className="bg-white/20 text-white">
                      {(displayUser.name ?? '?').charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm font-medium truncate">
                  {displayUser.name}
                </div>
                <div className="px-2 pb-1 text-xs text-muted-foreground truncate">
                  {displayUser.email}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  )
}
