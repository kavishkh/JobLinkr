import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Bell, Menu, X, Briefcase, Home, User, Sparkles, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { UserRole } from "@/lib/mockData";

const navItems = [
  { label: "Feed", path: "/", icon: Home },
  { label: "Jobs", path: "/jobs", icon: Briefcase },
  { label: "AI Matcher", path: "/ai-matcher", icon: Sparkles },
  { label: "Profile", path: "/profile", icon: User },
];

interface NavbarProps {
  role: UserRole;
  onToggleRole: () => void;
}

export function Navbar({ role, onToggleRole }: NavbarProps) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isEmployer = role === "employer";
  const allNavItems = isEmployer
    ? [...navItems, { label: "Dashboard", path: "/employer/dashboard", icon: Building2 }]
    : navItems;

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-primary">
          <Briefcase className="h-6 w-6" />
          JobLinkr
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {allNavItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Search (placeholder) */}
          <button className="hidden rounded-lg border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted sm:flex sm:items-center sm:gap-2">
            <Search className="h-4 w-4" />
            <span>Search…</span>
          </button>

          {/* Role Switcher */}
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleRole}
            className="hidden text-xs sm:flex"
          >
            {isEmployer ? (
              <>
                <Building2 className="mr-1 h-3.5 w-3.5" />
                Employer
              </>
            ) : (
              <>
                <User className="mr-1 h-3.5 w-3.5" />
                Seeker
              </>
            )}
          </Button>

          <button className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
          </button>

          <Link to="/profile">
            <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-primary/20 transition-all hover:ring-primary/40">
              <AvatarImage src="https://i.pravatar.cc/150?img=1" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="rounded-lg p-2 text-muted-foreground md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="border-t bg-card px-4 pb-4 pt-2 md:hidden">
          {allNavItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          <Button variant="outline" size="sm" onClick={onToggleRole} className="mt-2 w-full text-xs">
            Switch to {isEmployer ? "Seeker" : "Employer"}
          </Button>
        </nav>
      )}
    </header>
  );
}
