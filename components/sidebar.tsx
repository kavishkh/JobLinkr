'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Briefcase,
  Users,
  Settings,
  Heart,
  LogOut,
  Sparkles,
  Building2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useSession, signOut } from 'next-auth/react'
import {
  Sidebar as SidebarUI,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

const publicSidebarItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/jobs', label: 'Browse Jobs', icon: Briefcase },
  { href: '/matcher', label: 'AI Matcher', icon: Sparkles, requiresAuth: true },
  { href: '/employer', label: 'Employer Hub', icon: Building2 },
]

const authenticatedSidebarItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/jobs', label: 'Browse Jobs', icon: Briefcase },
  { href: '/matcher', label: 'AI Matcher', icon: Sparkles, requiresAuth: true },
  { href: '/profile', label: 'My Profile', icon: Users, requiresAuth: true },
  { href: '/employer', label: 'Employer Hub', icon: Building2 },
  { href: '/saved', label: 'Saved', icon: Heart, requiresAuth: true },
  { href: '/settings', label: 'Settings', icon: Settings, requiresAuth: true },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isMobile, setOpenMobile } = useSidebar()
  const { data: session, status } = useSession()
  const role = session?.user?.role
  
  const sidebarItems = (status === 'authenticated' ? authenticatedSidebarItems : publicSidebarItems)
    .filter(item => {
      if (item.href === '/employer' && role?.toLowerCase() === 'seeker') return false
      return true
    })

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
    toast.success('Logged out successfully')
    if (isMobile) setOpenMobile(false)
  }

  return (
    <SidebarUI className="top-16 h-[calc(100vh-4rem)] border-r border-border/50 bg-background/50 backdrop-blur-xl">
      <SidebarContent className="px-4 pt-6">
        <div className="mb-6 px-2">
          <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">
            Navigation
          </h2>
          <SidebarMenu>
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              const requiresAuth = (item as any).requiresAuth

              const handleClick = (e: React.MouseEvent) => {
                if (isMobile) setOpenMobile(false)
                
                if (requiresAuth && status !== 'authenticated') {
                  e.preventDefault()
                  router.push('/login')
                }
              }

              return (
                <SidebarMenuItem key={item.href} className="mb-1">
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.label}
                    className={cn(
                      'flex items-center gap-3 px-4 py-6 rounded-xl transition-all duration-300',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    )}
                  >
                    <Link
                      href={item.href}
                      onClick={handleClick}
                    >
                      <Icon className={cn("w-5 h-5 flex-shrink-0 transition-transform duration-300", isActive ? "scale-110" : "opacity-70 group-hover:opacity-100")} />
                      <span className="font-semibold tracking-tight">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </div>
      </SidebarContent>

      {status === 'authenticated' && (
        <SidebarFooter className="p-4 border-t border-border/30">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 font-bold text-sm"
          >
            <div className="size-8 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-destructive/20 transition-colors">
              <LogOut className="w-4 h-4" />
            </div>
            <span>Sign Out</span>
          </button>
        </SidebarFooter>
      )}
    </SidebarUI>
  )
}

