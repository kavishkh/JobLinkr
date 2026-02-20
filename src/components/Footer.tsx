import { Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-card/50 py-8">
      <div className="container flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-2 font-display font-semibold text-foreground">
          <Briefcase className="h-4 w-4 text-primary" />
          JobLinkr
        </div>
        <nav className="flex gap-4">
          <Link to="/" className="hover:text-foreground transition-colors">Feed</Link>
          <Link to="/jobs" className="hover:text-foreground transition-colors">Jobs</Link>
          <Link to="/profile" className="hover:text-foreground transition-colors">Profile</Link>
        </nav>
        <p>© 2026 JobLinkr. All rights reserved.</p>
      </div>
    </footer>
  );
}
