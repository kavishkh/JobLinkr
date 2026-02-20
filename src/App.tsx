import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { UserRole } from "@/lib/mockData";

import Feed from "@/pages/Feed";
import Jobs from "@/pages/Jobs";
import JobDetail from "@/pages/JobDetail";
import Profile from "@/pages/Profile";
import AiMatcher from "@/pages/AiMatcher";
import EmployerDashboard from "@/pages/EmployerDashboard";
import PublicProfile from "@/pages/PublicProfile";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [role, setRole] = useLocalStorage<UserRole>("joblinkr_role", "seeker");
  const toggleRole = () => setRole((r) => (r === "seeker" ? "employer" : "seeker"));

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout role={role} onToggleRole={toggleRole} />}>
              <Route path="/" element={<Feed role={role} />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/ai-matcher" element={<AiMatcher />} />
              <Route path="/employer/dashboard" element={<EmployerDashboard />} />
              <Route path="/profile/:username" element={<PublicProfile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
