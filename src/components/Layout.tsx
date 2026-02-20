import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import type { UserRole } from "@/lib/mockData";

interface LayoutProps {
  role: UserRole;
  onToggleRole: () => void;
}

export function Layout({ role, onToggleRole }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar role={role} onToggleRole={onToggleRole} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
