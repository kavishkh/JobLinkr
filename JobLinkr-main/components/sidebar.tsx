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
import { useSession } from 'next-auth/react'
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
  const { status } = useSession()
  
  const sidebarItems = status === 'authenticated' ? authenticatedSidebarItems : publicSidebarItems

  const handleLogout = () => {
    toast.success('Logged out successfully')
    router.push('/')
    if (isMobile) setOpenMobile(false)
  }

  return (
    <SidebarUI className="top-16 h-[calc(100vh-4rem)] border-r border-sidebar-border">
      <SidebarHeader className="p-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl"
          onClick={() => isMobile && setOpenMobile(false)}
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
            J
          </div>
          <span>JobLinkr</span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarMenu>
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            const requiresAuth = (item as any).requiresAuth

            const handleClick = (e: React.MouseEvent) => {
              if (isMobile) setOpenMobile(false)
              
              // If item requires auth and user is not authenticated, redirect to login
              if (requiresAuth && status !== 'authenticated') {
                e.preventDefault()
                router.push('/login')
              }
            }

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.label}
                  className={cn(
                    'flex items-center gap-3 px-4 py-6 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  )}
                >
                  <Link
                    href={item.href}
                    onClick={handleClick}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      {status === 'authenticated' && (
        <SidebarFooter className="p-4 border-t border-sidebar-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent text-sm font-medium transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </SidebarFooter>
      )}
    </SidebarUI>
  )
}
